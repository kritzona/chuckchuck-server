import {
  generateErrorStatus,
  generateSuccessStatus,
} from '../utils/rest-status'
import argon2 from 'argon2'
import RootController from './root.controller'
import { io } from '../../bin/www'
import mongoose from '../schemes/user.scheme'

class UsersController extends RootController {
  constructor(model, DialogModel) {
    super(model)

    this._dialogModel = DialogModel

    this.index = this.index.bind(this)
    this.store = this.store.bind(this)
    this.showContacts = this.showContacts.bind(this)
    this.editLastVisitedAt = this.editLastVisitedAt.bind(this)
    this.createContact = this.createContact.bind(this)
  }

  async index(req, res) {
    this.store(req, res)
  }
  async store(req, res) {
    const userId = req.query.userId
    const searchText = req.query.searchText

    const searchTextRegExps =
      searchText && searchText.length > 0
        ? searchText
            .split(' ')
            .map((searchTextItem) =>
              searchTextItem.length > 0
                ? new RegExp(`^${searchTextItem}|${searchTextItem}$`, 'i')
                : '',
            )
        : []

    const userItemsSource =
      searchText || searchText === ''
        ? await this._model
            .find(
              {
                $or: [
                  { login: { $in: searchTextRegExps } },
                  { firstName: { $in: searchTextRegExps } },
                  { lastName: { $in: searchTextRegExps } },
                ],
              },
              { password: 0, dialogs: 0 },
            )
            .lean()
        : await this._model.find({}, { password: 0, dialogs: 0 }).lean()
    const userItems = userItemsSource.map((userItem) => {
      userItem.id = userItem._id
      userItem.dialogId = ''

      return userItem
    })

    res.status(200).json(
      generateSuccessStatus({
        items: userItems,
      }),
    )
  }
  async show(req, res) {
    const id = req.params.id

    const newDate = new Date()

    Promise.all([
      this._model
        .findByIdAndUpdate(id, {
          $set: {
            lastVisitedAt: newDate,
          },
        })
        .lean(),
      this._model
        .findById(id, {
          password: 0,
        })
        .lean(),
    ]).then((result) => {
      const [, userItem] = result

      io.emit(`updated-user:user-${id}`, {
        lastVisitedAt: newDate.getTime(),
      })

      if (userItem) {
        userItem.id = userItem._id
        res.status(200).json(generateSuccessStatus({ item: userItem }))
      }
    })
  }
  async showContacts(req, res) {
    const id = req.params.id

    const user = await this._model.findById(id).lean()
    const dialogs = await this._dialogModel.find({
      _id: {
        $in: userDialogs,
      },
    })

    const items = await Promise.all(
      dialogs.map(async (dialog) => {
        const contactId = dialog.users.find(
          (userId) => String(userId) !== String(id),
        )
        const contact = await this._model.findById(contactId).lean()

        return contact
          ? {
              id: contact._id,
              login: contact.login,
              firstName: contact.firstName,
              lastName: contact.lastName,
              avatar: contact.avatar,
              dialogId: dialog.id,
              lastVisitedAt: new Date(contact.lastVisitedAt).getTime(),
            }
          : false
      }),
    )

    res.status(200).json(generateSuccessStatus({ items }))
  }
  async create(req, res) {
    const hashedPassword = await argon2.hash(req.body.password)
    const userItem = {
      login: req.body.login,
      password: hashedPassword,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      age: 0,
      city: '',
      about: '',
      avatar: '',
      dialogs: [],
      createdAt: new Date(),
      lastVisitedAt: new Date(),
    }

    await super.create(req, res, userItem)
  }
  async createContact(req, res) {
    const id = req.params.id
    const contactId = req.body.contactId

    Promise.all([
      this._model.exists({ _id: contactId }),
      this._dialogModel.exists({
        users: {
          $all: [id, contactId],
        },
      }),
    ])
      .then(async (results) => {
        const [existingContact, existingDialog] = results

        if (existingContact && !existingDialog) {
          const newDialog = new this._dialogModel({
            users: [
              mongoose.Types.ObjectId(id),
              mongoose.Types.ObjectId(contactId),
            ],
            messages: [],
            createdAt: new Date(),
          })

          const createdNewDialog = await newDialog.save()
          if (createdNewDialog) {
            const updatedUser = await this._model.findByIdAndUpdate(id, {
              $addToSet: {
                dialogs: mongoose.Types.ObjectId(createdNewDialog._id),
              },
            })
            const updatedContact = await this._model.findByIdAndUpdate(
              contactId,
              {
                $addToSet: {
                  dialogs: mongoose.Types.ObjectId(createdNewDialog._id),
                },
              },
            )

            if ((updatedUser, updatedContact)) {
              res
                .status(201)
                .json(generateSuccessStatus({ item: createdNewDialog }))
            } else {
              res.status(200).json(generateErrorStatus('OPERATION_FAILED'))
            }
          } else {
            res.status(200).json(generateErrorStatus('OPERATION_FAILED'))
          }
        }
      })
      .catch(() => {
        res.status(400).json(generateErrorStatus('INVALID_DATA'))
      })
  }
  async edit(req, res) {
    res.status(403).json(generateErrorStatus('ACCESS_DENIED'))
  }
  async editLastVisitedAt(req, res) {
    const id = req.params.id

    const newDate = new Date()
    await this._model
      .findByIdAndUpdate(id, {
        $set: {
          lastVisitedAt: newDate,
        },
      })
      .lean()
    io.emit(`updated-user:user-${id}`, {
      lastVisitedAt: newDate.getTime(),
    })
    res.status(200).json(generateSuccessStatus({}))
  }
  async destroy(req, res) {
    res.status(401).json(generateErrorStatus('UNAUTHORIZED'))
  }
  async destroyAll(req, res) {
    res.status(401).json(generateErrorStatus('UNAUTHORIZED'))
  }
}

export default UsersController

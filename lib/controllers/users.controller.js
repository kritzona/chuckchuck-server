import {
  generateErrorStatus,
  generateSuccessStatus,
} from '../utils/rest-status'
import argon2 from 'argon2'
import RootController from './root.controller'
import { io } from '../../bin/www'
import mongoose from '../schemes/user.scheme'

class UsersController extends RootController {
  constructor(model, DialogModel, MessageModel) {
    super(model)

    this._dialogModel = DialogModel
    this._messageModel = MessageModel

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
                _id: { $ne: mongoose.Types.ObjectId(userId) },
                contacts: { $ne: mongoose.Types.ObjectId(userId) },
                $or: [
                  { login: { $in: searchTextRegExps } },
                  { firstName: { $in: searchTextRegExps } },
                  { lastName: { $in: searchTextRegExps } },
                ],
              },
              { password: 0, dialogs: 0, contacts: 0 },
            )
            .lean()
        : await this._model
            .find({}, { password: 0, dialogs: 0, contacts: 0 })
            .lean()
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
        .findByIdAndUpdate(id, { $set: { lastVisitedAt: newDate } })
        .lean(),
      this._model.findById(id, { password: 0 }).lean(),
    ])
      .then((result) => {
        const [, userItem] = result

        io.emit(`updated-user:user-${id}`, {
          lastVisitedAt: newDate.getTime(),
        })

        userItem.id = userItem._id
        res.status(200).json(generateSuccessStatus({ item: userItem }))
      })
      .catch(() => {
        res.status(500).json(generateErrorStatus('DB_ERROR'))
      })
  }
  async showContacts(req, res) {
    const userId = req.params.id

    const user = await this._model.findById(userId).lean()
    const contacts = await this._model
      .find(
        { _id: { $in: user.contacts } },
        { password: 0, dialogs: 0, contacts: 0, createdAt: 0 },
      )
      .lean()

    const items = await Promise.all(
      contacts.map(async (contact) => {
        const dialog = await this._dialogModel
          .findOne(
            { users: { $all: [userId, contact._id] } },
            { id: 1, messages: 1 },
          )
          .lean()
        const lastMessage =
          dialog.messages.length > 0
            ? await this._messageModel
                .findById(dialog.messages[dialog.messages.length - 1])
                .lean()
            : null
        if (lastMessage) lastMessage.id = lastMessage._id

        return {
          id: contact._id,
          ...contact,
          dialogId: dialog._id,
          lastMessage: lastMessage || null,
        }
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

    const newDialog = new this._dialogModel({
      users: [mongoose.Types.ObjectId(id), mongoose.Types.ObjectId(contactId)],
      messages: [],
      createdAt: new Date(),
    })

    const createdNewDialog = await newDialog.save()
    if (createdNewDialog) {
      Promise.all([
        this._model.findByIdAndUpdate(id, {
          $addToSet: {
            dialogs: mongoose.Types.ObjectId(createdNewDialog._id),
            contacts: mongoose.Types.ObjectId(contactId),
          },
        }),
        this._model.findByIdAndUpdate(contactId, {
          $addToSet: {
            dialogs: mongoose.Types.ObjectId(createdNewDialog._id),
            contacts: mongoose.Types.ObjectId(id),
          },
        }),
      ])
        .then(() => {
          io.emit(`updated-contacts:user-${contactId}`)

          res
            .status(201)
            .json(generateSuccessStatus({ item: createdNewDialog }))
        })
        .catch(() => {
          res.status(200).json(generateErrorStatus('OPERATION_FAILED'))
        })
    } else {
      res.status(200).json(generateErrorStatus('OPERATION_FAILED'))
    }
  }
  async edit(req, res) {
    res.status(403).json(generateErrorStatus('ACCESS_DENIED'))
  }
  async editLastVisitedAt(req, res) {
    const id = req.params.id

    const newDate = new Date()
    await this._model
      .findByIdAndUpdate(id, {
        $set: { lastVisitedAt: newDate },
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

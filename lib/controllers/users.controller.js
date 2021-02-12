import {
  generateErrorStatus,
  generateSuccessStatus,
} from '../utils/rest-status'
import argon2 from 'argon2'
import { validationResult } from 'express-validator'
import RootController from './root.controller'
import {
  verifyAccessToken,
  verifyAccessTokenWithId,
} from '../utils/access-token'
import { io } from '../../bin/www'

class UsersController extends RootController {
  constructor(model, DialogModel) {
    super(model)

    this._dialogModel = DialogModel

    this.index = this.index.bind(this)
    this.store = this.store.bind(this)
    this.showContacts = this.showContacts.bind(this)
    this.editLastVisitedAt = this.editLastVisitedAt.bind(this)
  }

  async index(req, res) {
    this.store(req, res)
  }
  async store(req, res) {
    const userId = req.query.userId
    const accessToken = req.query.accessToken
    const searchText = req.query.searchText

    const verifiedAccessToken = await verifyAccessTokenWithId(
      userId,
      accessToken,
    )

    if (verifiedAccessToken) {
      const searchTextRegExps =
        searchText && searchText.length > 0
          ? searchText
              .split(' ')
              .map((searchTextItem) => new RegExp(`${searchTextItem}`, 'i'))
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
    } else {
      res.status(401).json(generateErrorStatus('UNAUTHORIZED'))
    }
  }
  async show(req, res) {
    const id = req.params.id
    const accessToken = req.query.accessToken

    const verifiedAccessToken = await verifyAccessTokenWithId(id, accessToken)
    if (verifiedAccessToken) {
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
    } else {
      res.status(401).json(generateErrorStatus('UNAUTHORIZED'))
    }
  }
  async showContacts(req, res) {
    const id = req.params.id
    const accessToken = req.query.accessToken

    const verifiedAccessToken = await verifyAccessTokenWithId(id, accessToken)
    if (verifiedAccessToken) {
      const user = await this._model.findById(id).lean()
      const userDialogs = user && user.dialogs ? user.dialogs : []
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
    } else {
      res.status(401).json(generateErrorStatus('UNAUTHORIZED'))
    }
  }
  async create(req, res) {
    const errors = validationResult(req)
    if (errors && errors.isEmpty()) {
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
      }

      await super.create(req, res, userItem)
    } else {
      res.status(400).json(generateErrorStatus('INVALID_DATA'))
    }
  }
  async edit(req, res) {
    res.status(403).json(generateErrorStatus('ACCESS_DENIED'))
  }
  async editLastVisitedAt(req, res) {
    const id = req.params.id
    const accessToken = req.query.accessToken

    const verifiedAccessToken = await verifyAccessTokenWithId(id, accessToken)
    if (verifiedAccessToken) {
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
    } else {
      res.status(401).json(generateErrorStatus('UNAUTHORIZED'))
    }
  }
  async destroy(req, res) {
    res.status(401).json(generateErrorStatus('UNAUTHORIZED'))
  }
  async destroyAll(req, res) {
    res.status(401).json(generateErrorStatus('UNAUTHORIZED'))
  }
}

export default UsersController

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

class UsersController extends RootController {
  constructor(model, DialogModel) {
    super(model)

    this._userModel = model
    this._dialogModel = DialogModel

    this.showContacts = this.showContacts.bind(this)
  }

  async index(req, res) {
    res.status(403).json(generateErrorStatus('ACCESS_DENIED'))
  }
  async store(req, res) {
    res.status(403).json(generateErrorStatus('ACCESS_DENIED'))
  }
  async show(req, res) {
    const id = req.params.id
    const accessToken = req.query.accessToken

    const verifiedAccessToken = await verifyAccessTokenWithId(id, accessToken)
    if (verifiedAccessToken) {
      await super.show(req, res, id)
    } else {
      res.status(401).json(generateErrorStatus('UNAUTHORIZED'))
    }
  }
  async showContacts(req, res) {
    const id = req.params.id
    const accessToken = req.query.accessToken

    const verifiedAccessToken = await verifyAccessTokenWithId(id, accessToken)
    if (verifiedAccessToken) {
      const user = await this._userModel.findById(id).exec()
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
          const contact = await this._userModel.findById(contactId).exec()

          return contact
            ? {
                id: contact._id,
                login: contact.login,
                firstName: contact.firstName,
                lastName: contact.lastName,
                avatar: contact.avatar,
                dialogId: dialog.id,
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
    const id = req.params.id

    await super.edit(req, res, id)
  }
  async destroy(req, res) {
    res.status(401).json(generateErrorStatus('UNAUTHORIZED'))
  }
  async destroyAll(req, res) {
    res.status(401).json(generateErrorStatus('UNAUTHORIZED'))
  }
}

export default UsersController

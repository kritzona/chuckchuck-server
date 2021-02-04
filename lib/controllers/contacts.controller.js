import RootController from './root.controller'
import {
  generateErrorStatus,
  generateSuccessStatus,
} from '../utils/rest-status'
import { verifyAccessToken } from '../utils/access-token'

class ContactsController extends RootController {
  constructor(model, userModel) {
    super(model)

    this._dialogModel = model
    this._userModel = userModel
  }

  async index(req, res) {
    await this.store(req, res)
  }
  async store(req, res) {
    const userId = req.params.userId
    const accessToken = req.query.accessToken
    const accessTokenData = await verifyAccessToken(accessToken)
    const currentUserId = accessTokenData ? accessTokenData.userId : null

    if (userId && userId === currentUserId) {
      const user = await this._userModel.findById(currentUserId).exec()
      const userDialogs = user && user.dialogs ? user.dialogs : []
      const dialogs = await this._dialogModel.find({
        _id: {
          $in: userDialogs,
        },
      })

      const items = await Promise.all(
        dialogs.map(async (dialog) => {
          const contactId = dialog.users.find(
            (userId) => userId !== currentUserId,
          )
          const contact = await this._userModel
            .findById(contactId, {
              _id: 1,
              login: 1,
              firstName: 1,
              lastName: 1,
              avatar: 1,
            })
            .exec()

          if (contact) {
            return {
              id: contact._id,
              login: contact.login,
              firstName: contact.firstName,
              lastName: contact.lastName,
              avatar: contact.avatar,
              dialogId: dialog.id,
            }
          }

          return false
        }),
      )

      res.status(200).json(generateSuccessStatus({ items }))
    } else {
      res.status(403).json(generateErrorStatus('ACCESS_DENIED'))
    }
  }
  async show(req, res) {
    res.status(403).json(generateErrorStatus('ACCESS_DENIED'))
  }
  async create(req, res) {
    await super.create(req, res, {
      users: ['60157477f2ac98319cc9011c', '60190720e41e092d8cb5b21b'],
      messages: [],
      createdAt: new Date(),
    })
  }
  async edit(req, res) {
    res.status(403).json(generateErrorStatus('ACCESS_DENIED'))
  }
  async destroy(req, res) {
    res.status(403).json(generateErrorStatus('ACCESS_DENIED'))
  }
  async destroyAll(req, res) {
    res.status(403).json(generateErrorStatus('ACCESS_DENIED'))
  }
}

export default ContactsController

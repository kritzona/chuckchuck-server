import RootController from './root.controller'
import {
  generateErrorStatus,
  generateSuccessStatus,
} from '../utils/rest-status'
import { verifyAccessToken } from '../utils/access-token'

class DialogsController extends RootController {
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
      const user = await this._userModel.findById(userId).exec()
      const userDialogs = user && user.dialogs ? user.dialogs : []

      const items = await this._dialogModel.find({
        _id: {
          $in: userDialogs,
        },
      })

      res.status(200).json(generateSuccessStatus({ items }))
    } else {
      res.status(403).json(generateErrorStatus('ACCESS_DENIED'))
    }
  }
  async show(req, res) {
    res.status(403).json(generateErrorStatus('ACCESS_DENIED'))
  }
  async create(req, res) {
    res.status(403).json(generateErrorStatus('ACCESS_DENIED'))
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

export default DialogsController

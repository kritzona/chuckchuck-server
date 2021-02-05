import RootController from './root.controller'
import {
  generateErrorStatus,
  generateSuccessStatus,
} from '../utils/rest-status'
import { verifyAccessTokenWithId } from '../utils/access-token'

class DialogsController extends RootController {
  constructor(model, MessageModel, UserModel) {
    super(model)

    this._messageModel = MessageModel
    this._userModel = UserModel

    this.showMessages = this.showMessages.bind(this)
    this.createMessage = this.createMessage.bind(this)
    this.findUserInDialog = this.findUserInDialog.bind(this)
  }

  async index(req, res) {
    res.status(403).json(generateErrorStatus('ACCESS_DENIED'))
  }
  async store(req, res) {
    res.status(403).json(generateErrorStatus('ACCESS_DENIED'))
  }
  async show(req, res) {
    const dialogId = req.params.id

    const userId = req.query.userId
    const accessToken = req.query.accessToken

    const verifiedAccessToken = await verifyAccessTokenWithId(
      userId,
      accessToken,
    )
    const existUserInDialog = await this.findUserInDialog(userId, dialogId)
    if (verifiedAccessToken && existUserInDialog) {
      await super.show(req, res, dialogId)
    } else {
      res.status(401).json(generateErrorStatus('UNAUTHORIZED'))
    }
  }
  async showMessages(req, res) {
    const dialogId = req.params.id

    const userId = req.query.userId
    const accessToken = req.query.accessToken

    const verifiedAccessToken = await verifyAccessTokenWithId(
      userId,
      accessToken,
    )
    const existUserInDialog = await this.findUserInDialog(userId, dialogId)
    if (verifiedAccessToken && existUserInDialog) {
      const dialog = await this._model.findById(dialogId).exec()
      const messages = await this._messageModel
        .find({
          _id: {
            $in: dialog.messages,
          },
        })
        .exec()

      console.log(messages, dialog)

      res.status(200).json(generateSuccessStatus({ items: messages }))
    } else {
      res.status(401).json(generateErrorStatus('UNAUTHORIZED'))
    }
  }
  async create(req, res) {
    res.status(403).json(generateErrorStatus('ACCESS_DENIED'))
  }
  async createMessage(req, res) {
    const dialogId = req.params.id

    const userId = req.query.userId
    const accessToken = req.query.accessToken

    const content = req.body.content

    const verifiedAccessToken = await verifyAccessTokenWithId(
      userId,
      accessToken,
    )
    const existUserInDialog = await this.findUserInDialog(userId, dialogId)
    if (verifiedAccessToken && existUserInDialog) {
      const dialog = await this._model.findById(dialogId).exec()
      const contactId = dialog.users.find(
        (user) => String(user) !== String(userId),
      )

      const newMessage = new this._messageModel({
        senderId: userId,
        recipientId: contactId,
        content: content,
        createdAt: Date.now(),
      })
      const savedMessage = await newMessage.save()

      if (savedMessage) {
        res.status(201).json(generateSuccessStatus({ item: savedMessage }))
      }
    } else {
      res.status(401).json(generateErrorStatus('UNAUTHORIZED'))
    }
  }
  async edit(req, res) {
    res.status(403).json(generateErrorStatus('ACCESS_DENIED'))
  }
  async destroy(req, res) {
    res.status(401).json(generateErrorStatus('UNAUTHORIZED'))
  }
  async destroyAll(req, res) {
    res.status(401).json(generateErrorStatus('UNAUTHORIZED'))
  }

  async findUserInDialog(userId, dialogId) {
    return this._model.findById(dialogId, (err, dialog) => {
      if (!err) {
        const foundUser = dialog.users.find(
          (user) => String(user) === String(userId),
        )

        return !!foundUser
      }

      return false
    })
  }
}

export default DialogsController
import RootController from './root.controller'
import {
  generateErrorStatus,
  generateSuccessStatus,
} from '../utils/rest-status'
import { io } from '../../bin/www'

class DialogsController extends RootController {
  constructor(model, MessageModel, UserModel) {
    super(model)

    this._messageModel = MessageModel
    this._userModel = UserModel

    this.showMessages = this.showMessages.bind(this)
    this.createMessage = this.createMessage.bind(this)
    this.sendMessage = this.sendMessage.bind(this)
  }

  async index(req, res) {
    res.status(403).json(generateErrorStatus('ACCESS_DENIED'))
  }
  async store(req, res) {
    res.status(403).json(generateErrorStatus('ACCESS_DENIED'))
  }
  async show(req, res) {
    const dialogId = req.params.id

    const dialogItem = await this._model.findById(dialogId).lean()
    dialogItem.id = dialogItem._id

    res.status(200).json(generateSuccessStatus({ item: dialogItem }))
  }
  async showMessages(req, res) {
    const dialogId = req.params.id

    const dialog = await this._model.findById(dialogId).lean()
    const messagesSource = await this._messageModel
      .find({
        _id: {
          $in: dialog.messages,
        },
      })
      .lean()
    const messages = messagesSource.map((message) => ({
      id: message._id,
      ...message,
    }))

    res.status(200).json(generateSuccessStatus({ items: messages }))
  }
  async create(req, res) {
    res.status(403).json(generateErrorStatus('ACCESS_DENIED'))
  }
  async createMessage(req, res) {
    const dialogId = req.params.id
    const userId = req.query.userId
    const content = req.body.content

    const dialog = await this._model.findById(dialogId).lean()
    const contactId = dialog.users.find(
      (user) => String(user) !== String(userId),
    )

    const sendedMessage = await this.sendMessage(
      userId,
      contactId,
      dialogId,
      content,
    )

    if (sendedMessage) {
      io.emit(`sended-message:dialog-${dialogId}`, {
        message: {
          id: sendedMessage.id,
          senderId: sendedMessage.senderId,
          recipientId: sendedMessage.recipientId,
          content: sendedMessage.content,
          createdAt: sendedMessage.createdAt,
        },
      })
      res.status(201).json(generateSuccessStatus({ item: sendedMessage }))
    } else {
      res.status(200).json(generateErrorStatus('SEND_FAILED'))
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

  async sendMessage(userId, contactId, dialogId, content) {
    const newMessage = new this._messageModel({
      senderId: userId,
      recipientId: contactId,
      content: content,
      createdAt: new Date(),
    })
    const savedMessage = await newMessage.save()
    const updatedDialog =
      savedMessage &&
      (await this._model.findByIdAndUpdate(dialogId, {
        $addToSet: {
          messages: [savedMessage.id],
        },
      }))

    return updatedDialog ? savedMessage : false
  }
}

export default DialogsController

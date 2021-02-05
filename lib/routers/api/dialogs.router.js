import express from 'express'
import DialogsController from '../../controllers/dialogs.controller'
import DialogModel from '../../models/dialog.model'
import MessageModel from '../../models/message.model'
import UserModel from '../../models/user.model'
import { check } from 'express-validator'
import checkAuth from '../../middlewares/check-auth'

const dialogsController = new DialogsController(
  DialogModel,
  MessageModel,
  UserModel,
)
const dialogsRouter = express.Router()
dialogsRouter.get('/', checkAuth, dialogsController.index)
dialogsRouter.get('/:id', checkAuth, dialogsController.show)
dialogsRouter.get('/:id/messages', checkAuth, dialogsController.showMessages)
dialogsRouter.post('/', checkAuth, dialogsController.create)
dialogsRouter.post('/:id/messages', checkAuth, dialogsController.createMessage)
dialogsRouter.put('/:id', checkAuth, dialogsController.edit)
dialogsRouter.delete('/', checkAuth, dialogsController.destroyAll)
dialogsRouter.delete('/:id', checkAuth, dialogsController.destroy)

export default dialogsRouter

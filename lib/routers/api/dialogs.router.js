import express from 'express'
import DialogsController from '../../controllers/dialogs.controller'
import DialogModel from '../../models/dialog.model'
import MessageModel from '../../models/message.model'
import UserModel from '../../models/user.model'
import { check } from 'express-validator'
import checkAuth from '../../middlewares/check-auth'
import existUserInDialog from '../../middlewares/exist-user-in-dialog'
import existDialog from '../../middlewares/exist-dialog'

const dialogsController = new DialogsController(
  DialogModel,
  MessageModel,
  UserModel,
)
const dialogsRouter = express.Router()
dialogsRouter.get('/', checkAuth, dialogsController.index)
dialogsRouter.get('/:id', checkAuth, existUserInDialog, dialogsController.show)
dialogsRouter.get(
  '/:id/messages',
  checkAuth,
  existDialog,
  existUserInDialog,
  dialogsController.showMessages,
)
dialogsRouter.post('/', checkAuth, dialogsController.create)
dialogsRouter.post(
  '/:id/messages',
  checkAuth,
  existDialog,
  existUserInDialog,
  dialogsController.createMessage,
)
dialogsRouter.put('/:id', checkAuth, dialogsController.edit)
dialogsRouter.delete('/', checkAuth, dialogsController.destroyAll)
dialogsRouter.delete('/:id', checkAuth, dialogsController.destroy)

export default dialogsRouter

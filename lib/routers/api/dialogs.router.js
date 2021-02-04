import express from 'express'
import DialogModel from '../../models/dialog.model'
import UserModel from '../../models/user.model'
import DialogsController from '../../controllers/dialogs.controller'

const dialogsController = new DialogsController(DialogModel, UserModel)
const dialogsRouter = express.Router({
  mergeParams: true,
})
dialogsRouter.get('/', dialogsController.index)

export default dialogsRouter

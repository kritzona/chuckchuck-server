import express from 'express'
import DialogModel from '../../models/dialog.model'
import UserModel from '../../models/user.model'
import ContactsController from '../../controllers/contacts.controller'

const contactsController = new ContactsController(DialogModel, UserModel)
const contactsRouter = express.Router({
  mergeParams: true,
})
contactsRouter.get('/', contactsController.index)
contactsRouter.post('/', contactsController.create)

export default contactsRouter

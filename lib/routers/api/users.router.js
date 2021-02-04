import express from 'express'
import checkAuth from '../../middlewares/check-auth'
import { body } from 'express-validator'
import UsersController from '../../controllers/users.controller'
import UserModel from '../../models/user.model'
import contactsRouter from './contacts.router'

const usersController = new UsersController(UserModel)
const usersRouter = express.Router()
usersRouter.use('/:userId/contacts', contactsRouter)
usersRouter.get('/', checkAuth, usersController.index)
usersRouter.get('/:id', checkAuth, usersController.show)
usersRouter.post(
  '/',
  body(['login', 'firstName', 'lastName'])
    .exists()
    .isLength({ min: 1, max: 20 })
    .isString()
    .trim()
    .escape(),
  body('password')
    .exists()
    .isLength({ min: 5, max: 128 })
    .isString()
    .trim()
    .escape(),
  usersController.create,
)
usersRouter.put('/:id', checkAuth, usersController.edit)
usersRouter.delete('/', checkAuth, usersController.destroyAll)
usersRouter.delete('/:id', checkAuth, usersController.destroy)

export default usersRouter

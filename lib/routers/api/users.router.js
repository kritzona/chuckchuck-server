import express from 'express'
import checkAuth from '../../middlewares/check-auth'
import { body } from 'express-validator'
import UsersController from '../../controllers/users.controller'
import UserModel from '../../models/user.model'
import DialogModel from '../../models/dialog.model'
import userCreateValidation from '../../middlewares/user-create-validation'
import nonExistUser from '../../middlewares/non-exist-user'

const usersController = new UsersController(UserModel, DialogModel)
const usersRouter = express.Router()
usersRouter.get('/', checkAuth, usersController.index)
usersRouter.get('/:id', checkAuth, usersController.show)
usersRouter.get('/:id/contacts', checkAuth, usersController.showContacts)
usersRouter.post(
  '/',
  body(['login', 'firstName', 'lastName'])
    .exists()
    .notEmpty()
    .withMessage('EMPTY_FIELD')
    .isLength({ max: 20 })
    .withMessage('INVALID_FIELD_LENGTH')
    .isString()
    .trim()
    .escape(),
  body('password')
    .exists()
    .notEmpty()
    .withMessage('EMPTY_FIELD')
    .isLength({ min: 5, max: 128 })
    .withMessage('INVALID_FIELD_LENGTH')
    .isString()
    .trim()
    .escape(),
  userCreateValidation,
  nonExistUser,
  usersController.create,
)
usersRouter.post('/:id/contacts', checkAuth, usersController.createContact)
usersRouter.put('/:id', checkAuth, usersController.edit)
usersRouter.patch('/:id', checkAuth, usersController.editLastVisitedAt)
usersRouter.delete('/', checkAuth, usersController.destroyAll)
usersRouter.delete('/:id', checkAuth, usersController.destroy)

export default usersRouter

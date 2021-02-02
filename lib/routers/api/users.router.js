import express from 'express'
import checkAuth from '../../middlewares/check-auth'
import { body } from 'express-validator'
import UsersController from '../../controllers/users.controller'
import UserModel from '../../models/user.model'

const userController = new UsersController(UserModel)
const userRouter = express.Router()
userRouter.get('/', checkAuth, userController.index)
userRouter.get('/:id', checkAuth, userController.show)
userRouter.post(
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
  userController.create,
)
userRouter.put('/:id', checkAuth, userController.edit)
userRouter.delete('/', checkAuth, userController.destroyAll)
userRouter.delete('/:id', checkAuth, userController.destroy)

export default userRouter

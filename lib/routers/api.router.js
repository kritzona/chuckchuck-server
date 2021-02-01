import express from 'express'
import usersController from '../controllers/users.controller'

const apiRouter = express.Router()
apiRouter.use('/users', usersController)

export default apiRouter

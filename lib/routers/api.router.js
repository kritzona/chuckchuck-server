import express from 'express'
import usersRouter from './api/users.router'

const apiRouter = express.Router()
apiRouter.use('/users', usersRouter)

export default apiRouter

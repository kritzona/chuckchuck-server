import express from 'express'
import usersRouter from './api/users.router'
import dialogsRouter from './api/dialogs.router'

const apiRouter = express.Router()
apiRouter.use('/users', usersRouter)
apiRouter.use('/dialogs', dialogsRouter)

export default apiRouter

import express from 'express'
import usersRouter from './api/users.router'
import contactsRouter from './api/contacts.router'

const apiRouter = express.Router()
apiRouter.use('/users', usersRouter)
apiRouter.use('/dialogs', contactsRouter)

export default apiRouter

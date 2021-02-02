import express from 'express'
import userRouter from './api/users.router'

const apiRouter = express.Router()
apiRouter.use('/users', userRouter)

export default apiRouter

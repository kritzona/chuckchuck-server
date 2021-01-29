import express from 'express'
import path from 'path'
import cookieParser from 'cookie-parser'
import logger from 'morgan'

import usersRouter from './routes/users-router'
import dialogsRouter from './routes/dialogs-router'
import messagesRouter from './routes/messages-router'

const app = express()

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, '../public')))

app.use('/api/users', usersRouter)
app.use('/api/dialogs', dialogsRouter)
app.use('/api/messages', messagesRouter)

app.use('/', function (req, res, next) {
  res.send(404, 'Error: 404. Page not found')
})

export default app

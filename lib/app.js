import express from 'express'
import path from 'path'
import cookieParser from 'cookie-parser'
import logger from 'morgan'
import mongoose from 'mongoose'
import cors from 'cors'
import config from './config'
import compression from 'compression'

import apiRouter from './routers/api.router'
import servicesRouter from './routers/services.router'

const mongodbConnection = mongoose.connect(config.mongoose.url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true,
})

const app = express()

app.use(cors())
app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, '../public')))
app.use(compression())

app.use('/api', apiRouter)
app.use('/services', servicesRouter)

app.use('/', function (req, res, next) {
  res.status(404).send('Error: 404. Page not found')
})

export default app

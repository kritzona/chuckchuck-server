import express from 'express'
import loginService from '../services/login.service'

const servicesRouter = express.Router()
servicesRouter.post('/login', loginService)

export default servicesRouter

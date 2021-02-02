import express from 'express'
import loginService from '../services/login.service'
import checkAuth from '../middlewares/check-auth'
import fetchSelfService from '../services/fetch-self.service'

const servicesRouter = express.Router()
servicesRouter.post('/login', loginService)
servicesRouter.get('/fetch-self', checkAuth, fetchSelfService)

export default servicesRouter

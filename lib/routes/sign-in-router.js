import express from 'express'
import SignInController from '../controllers/sign-in-router'

const router = express.Router()
router.post('/', (req, res, next) => {
  const signInController = new SignInController(req, res, next)
  signInController.post()
})

export default router

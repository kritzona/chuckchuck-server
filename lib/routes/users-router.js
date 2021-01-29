import express from 'express'
import usersController from '../controllers/users-controller'

const router = express.Router()

router.get('/', (req, res, next) => {
  usersController.getAll(req, res, next)
})
router.get('/:id', (req, res, next) => {
  usersController.getById(req, res, next)
})
router.post('/', (req, res, next) => {
  usersController.post(req, res, next)
})
router.put('/:id', (req, res, next) => {
  usersController.putById(req, res, next)
})
router.delete('/', (req, res, next) => {
  usersController.deleteAll(req, res, next)
})
router.delete('/:id', (req, res, next) => {
  usersController.deleteById(req, res, next)
})

export default router

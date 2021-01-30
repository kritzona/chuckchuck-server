import express from 'express'
import UsersController from '../controllers/users-controller'

const router = express.Router()

router.get('/', (req, res, next) => {
  const usersController = new UsersController(req, res, next)
  usersController.getAll()
})
router.get('/:id', (req, res, next) => {
  const usersController = new UsersController(req, res, next)
  usersController.getById()
})
router.post('/', (req, res, next) => {
  const usersController = new UsersController(req, res, next)
  usersController.post()
})
router.put('/:id', (req, res, next) => {
  const usersController = new UsersController(req, res, next)
  usersController.putById()
})
router.delete('/', (req, res, next) => {
  const usersController = new UsersController(req, res, next)
  usersController.deleteAll()
})
router.delete('/:id', (req, res, next) => {
  const usersController = new UsersController(req, res, next)
  usersController.deleteById()
})

export default router

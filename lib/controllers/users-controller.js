import { generateSuccessStatus } from '../utils/status-generator'

class UsersController {
  constructor() {}

  getAll(req, res, next) {
    res.status(200).json(generateSuccessStatus({}))
  }
  getById(req, res, next) {
    res.status(200).json(generateSuccessStatus({}))
  }
  post(req, res, next) {
    res.status(201).json(generateSuccessStatus(null))
  }
  putById(req, res, next) {
    res.status(200).json(generateSuccessStatus(null))
  }
  deleteAll(req, res, next) {
    res.status(204).json(generateSuccessStatus(null))
  }
  deleteById(req, res, next) {
    res.status(204).json(generateSuccessStatus(null))
  }
}

export default new UsersController()

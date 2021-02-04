import {
  generateErrorStatus,
  generateSuccessStatus,
} from '../utils/rest-status'
import argon2 from 'argon2'
import { validationResult } from 'express-validator'
import RootController from './root.controller'
import { verifyAccessToken } from '../utils/access-token'

class UsersController extends RootController {
  constructor(model) {
    super(model)
  }

  async index(req, res) {
    res.status(403).json(generateErrorStatus('ACCESS_DENIED'))
  }
  async store(req, res) {
    res.status(403).json(generateErrorStatus('ACCESS_DENIED'))
  }
  async show(req, res) {
    const id = req.params.id
    const accessToken = req.query.accessToken
    const accessTokenData = await verifyAccessToken(accessToken)
    const currentUserId = accessTokenData ? accessTokenData.userId : null

    if (id === currentUserId) {
      await super.show(req, res, id)
    } else {
      res.status(401).json(generateErrorStatus('UNAUTHORIZED'))
    }
  }
  async create(req, res) {
    const errors = validationResult(req)
    if (errors && errors.isEmpty()) {
      const hashedPassword = await argon2.hash(req.body.password)
      const userItem = {
        login: req.body.login,
        password: hashedPassword,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        age: 0,
        city: '',
        about: '',
        avatar: '',
        dialogs: [],
        createdAt: new Date(),
      }

      await super.create(req, res, userItem)
    } else {
      res.status(400).json(generateErrorStatus('INVALID_DATA'))
    }
  }
  async edit(req, res) {
    const id = req.params.id

    await super.edit(req, res, id)
  }
  async destroy(req, res) {
    res.status(401).json(generateErrorStatus('UNAUTHORIZED'))
  }
  async destroyAll(req, res) {
    res.status(401).json(generateErrorStatus('UNAUTHORIZED'))
  }
}

export default UsersController

import UserModel from '../models/user.model'
import {
  generateErrorStatus,
  generateSuccessStatus,
} from '../utils/rest-status'
import argon2 from 'argon2'
import { validationResult } from 'express-validator'
import RootController from './root.controller'

class UsersController extends RootController {
  constructor(model) {
    super(model)

    this.create = this.create.bind(this)
  }

  async create(req, res) {
    const errors = validationResult(req)
    if (errors && errors.isEmpty()) {
      const hashedPassword = await argon2.hash(req.body.password)

      const newItem = new this._model({
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
      })
      await newItem.save((err, item) => {
        if (!err) {
          res.status(201).json(generateSuccessStatus({ item }))
        } else {
          res.status(200).json(generateErrorStatus(err))
        }
      })
    } else {
      res.status(400).json(generateErrorStatus('INVALID_DATA'))
    }
  }
}

export default UsersController

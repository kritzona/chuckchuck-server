import mongoose from 'mongoose'
import {
  generateSuccessStatus,
  generateErrorStatus,
} from '../utils/rest-status'
import UserModel from '../models/user-model'
import argon2 from 'argon2'

class UsersController {
  constructor(req, res, next) {
    this.req = req
    this.res = res
    this.next = next
  }

  getAll() {
    UserModel.find({}, (err, users) => {
      if (!err) {
        this.res.status(200).json(generateSuccessStatus({ users }))
      } else {
        this.res.status(200).json(generateErrorStatus(err))
      }
    })
  }
  getById() {
    const id = this.req.params.id
    UserModel.findById(id, (err, user) => {
      if (!err) {
        this.res.status(200).json(generateSuccessStatus({ user }))
      } else {
        this.res.status(200).json(generateErrorStatus(err))
      }
    })
  }
  async post() {
    const userPassword = await argon2.hash('12345')

    const userModel = new UserModel({
      _id: new mongoose.Types.ObjectId(),
      login: 'kritzona',
      password: userPassword,
      firstName: 'Влад',
      lastName: 'Усманов',
      age: 22,
      city: 'Ярославль',
      about: 'JS Разработчик',
      avatar: '',
      dialogs: [],
      createdAt: new Date(),
    })
    userModel.save((err) => {
      if (!err) {
        this.res.status(201).json(generateSuccessStatus(null))
      } else {
        this.res.status(200).json(generateErrorStatus(err))
      }
    })
  }
  putById() {
    // UserModel.updateOne({ _id: req.params.id })
    this.res.status(200).json(generateSuccessStatus(null))
  }
  deleteAll() {
    UserModel.deleteMany({}, {}, (err) => {
      if (!err) {
        this.res.status(204).json(generateSuccessStatus(null))
      } else {
        this.res.status(200).json(generateErrorStatus(err))
      }
    })
  }
  deleteById() {
    const id = this.req.params.id
    UserModel.findByIdAndDelete(id, (err) => {
      if (!err) {
        this.res.status(204).json(generateSuccessStatus(null))
      } else {
        this.res.status(200).json(generateErrorStatus(err))
      }
    })
  }
}

export default UsersController

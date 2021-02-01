import express from 'express'
import UserModel from '../models/user.model'
import {
  generateErrorStatus,
  generateSuccessStatus,
} from '../utils/rest-status'
import argon2 from 'argon2'
import loginMiddleware from '../middlewares/login.middleware'

const getItems = async (req, res) => {
  await UserModel.find({}, (err, items) => {
    if (!err) {
      res.status(200).json(generateSuccessStatus({ items }))
    } else {
      res.status(200).json(generateErrorStatus(err))
    }
  })
}
const getItemById = async (req, res) => {
  const id = req.params.id

  await UserModel.findById(id, (err, item) => {
    if (!err) {
      res.status(200).json(generateSuccessStatus({ item }))
    } else {
      res.status(200).json(generateErrorStatus('USER_NOT_FOUND'))
    }
  })
}
const postItem = async (req, res) => {
  const hashedPassword = await argon2.hash(req.body.password)

  const newItem = new UserModel({
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
}
const putById = async (req, res) => {
  const id = req.params.id

  res.status(200).json(generateSuccessStatus({}))
}
const deleteItems = async (req, res) => {
  await UserModel.deleteMany({}, {}, (err) => {
    if (!err) {
      res.status(410).json(generateSuccessStatus({}))
    } else {
      res.status(200).json(generateErrorStatus(err))
    }
  })
}
const deleteItemById = async (req, res) => {
  const id = req.params.id

  await UserModel.findByIdAndDelete(id, {}, (err) => {
    if (!err) {
      res.status(410).json(generateSuccessStatus({}))
    } else {
      res.status(200).json(generateErrorStatus(err))
    }
  })
}

const router = express.Router()
router.get('/', loginMiddleware, getItems)
router.get('/:id', loginMiddleware, getItemById)
router.post('/', postItem)
router.put('/:id', loginMiddleware, putById)
router.delete('/', loginMiddleware, deleteItems)
router.delete('/:id', loginMiddleware, deleteItemById)

export default router

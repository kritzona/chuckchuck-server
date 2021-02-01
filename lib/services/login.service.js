import UserModel from '../models/user.model'
import argon2 from 'argon2'
import { generateAccessToken } from '../utils/access-token'
import {
  generateErrorStatus,
  generateSuccessStatus,
} from '../utils/rest-status'

const verifyPassword = async (hashedPassword, password) => {
  return await argon2.verify(hashedPassword, password)
}
const verifyUser = async (login, password) => {
  const foundUser = await UserModel.findOne({ login }).exec()
  const verifiedPassword = foundUser
    ? await verifyPassword(foundUser.password, password)
    : false

  if (verifiedPassword) {
    return foundUser
  }

  return null
}

const loginService = async (req, res) => {
  const login = req.body.login
  const password = req.body.password
  const remember = req.body.remember

  const verifiedUser = await verifyUser(login, password)

  const accessToken = verifiedUser
    ? await generateAccessToken(verifiedUser.id)
    : null
  if (accessToken) {
    const userCookie = {
      id: verifiedUser._id,
      login: verifiedUser.login,
      firstName: verifiedUser.firstName,
      lastName: verifiedUser.lastName,
      age: verifiedUser.age,
      city: verifiedUser.city,
      about: verifiedUser.about,
      avatar: verifiedUser.avatar,
      createdAt: verifiedUser.createdAt,
      accessToken,
    }

    if (remember === 'yes') {
      res.cookie('chuckchuck_user', userCookie, { maxAge: 86400000 })
    } else {
      res.cookie('chuckchuck_user', userCookie, { maxAge: null })
    }

    res.status(200).json(generateSuccessStatus(userCookie))
  } else {
    res.status(401).json(generateErrorStatus('LOGIN_FAILED'))
  }
}

export default loginService

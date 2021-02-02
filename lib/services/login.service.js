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

  const verifiedUser = await verifyUser(login, password)

  const accessToken = verifiedUser
    ? await generateAccessToken(verifiedUser.id)
    : null
  if (accessToken) {
    const userCookie = {
      id: verifiedUser._id,
      accessToken,
    }

    res.status(200).json(generateSuccessStatus({ item: userCookie }))
  } else {
    res.status(401).json(generateErrorStatus('LOGIN_FAILED'))
  }
}

export default loginService

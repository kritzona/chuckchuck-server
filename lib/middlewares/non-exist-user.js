import UserModel from '../models/user.model'
import { generateErrorStatus } from '../utils/rest-status'

const nonExistUser = async (req, res, next) => {
  const userLogin = req.body.login

  const existUser = await UserModel.exists({
    login: userLogin,
  })
  if (existUser) return res.status(200).json(generateErrorStatus('USER_EXIST'))

  next()
}

export default nonExistUser

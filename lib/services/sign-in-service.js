import argon2 from 'argon2'
import UserModel from '../models/user-model'
import { generateToken } from '../utils/token'

class SignInService {
  constructor(login = '', password = '') {
    this.login = login
    this.password = password
  }

  async auth() {
    let token = ''
    const checkedUser = await this.checkUser()

    if (checkedUser) {
      token = await generateToken(checkedUser._id)

      return token
    }

    return false
  }

  async checkUser() {
    let checkedUser = false

    await UserModel.findOne({ login: this.login }, (err, user) => {
      if (!err) {
        checkedUser = user
      }
    })

    if (checkedUser) {
      const checked = await argon2.verify(checkedUser.password, this.password)

      if (checked) {
        return checkedUser
      }
    }

    return false
  }
}

export default SignInService

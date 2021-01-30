import {
  generateErrorStatus,
  generateSuccessStatus,
} from '../utils/rest-status'
import SignInService from '../services/sign-in-service'

class SignInController {
  constructor(req, res, next) {
    this.req = req
    this.res = res
    this.next = next
  }

  post() {
    const login = this.req.body.login
    const password = this.req.body.password

    const signInService = new SignInService(login, password)
    signInService.auth().then((token) => {
      if (token) {
        this.res
          .cookie('chuckchuck_accesstoken', token)
          .status(201)
          .json(generateSuccessStatus({ token }))
      } else {
        this.res
          .status(200)
          .json(generateErrorStatus('Неверные логин или пароль'))
      }
    })
  }
}

export default SignInController

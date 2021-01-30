import {
  generateErrorStatus,
  generateSuccessStatus,
} from '../utils/rest-status'
import { verifyToken } from '../utils/token'

class UsersMiddleware {
  constructor(req, res, next) {
    this.req = req
    this.res = res
    this.next = next
  }

  verify() {
    const accessToken = this.req.cookies.chuckchuck_accesstoken

    if (accessToken) {
      verifyToken(accessToken).then((payload) => {
        if (payload) {
          this.next()
        } else {
          this.res
            .status(401)
            .json(generateErrorStatus('Недействительный токен'))
        }
      })
    } else {
      this.res.status(401).json(generateErrorStatus('Доступ запрещен'))
    }
  }
}

export default UsersMiddleware

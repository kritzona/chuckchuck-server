import { verifyAccessToken } from '../utils/access-token'
import { generateErrorStatus } from '../utils/rest-status'

const loginMiddleware = async (req, res, next) => {
  const userCookie = req.cookies.chuckchuck_user

  console.log(userCookie)

  if (
    userCookie &&
    userCookie.id &&
    userCookie.accessToken &&
    (await verifyAccessToken(userCookie.accessToken))
  ) {
    next()
  } else {
    res.status(403).json(generateErrorStatus('ACCESS_DENIED'))
  }
}

export default loginMiddleware

import { verifyAccessToken } from '../utils/access-token'
import { generateErrorStatus } from '../utils/rest-status'

const checkAuth = async (req, res, next) => {
  const accessToken = req.query.accessToken

  console.log(accessToken)

  if (accessToken && (await verifyAccessToken(accessToken))) {
    next()
  } else {
    console.log('error_token', accessToken)
    res.status(401).json(generateErrorStatus('UNAUTHORIZED'))
  }
}

export default checkAuth

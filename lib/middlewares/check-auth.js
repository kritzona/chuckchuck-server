import { verifyAccessToken } from '../utils/access-token'
import { generateErrorStatus } from '../utils/rest-status'

const checkAuth = async (req, res, next) => {
  const accessToken = req.query.accessToken

  if (accessToken && (await verifyAccessToken(accessToken))) {
    next()
  } else {
    res.status(401).json(generateErrorStatus('UNAUTHORIZED'))
  }
}

export default checkAuth

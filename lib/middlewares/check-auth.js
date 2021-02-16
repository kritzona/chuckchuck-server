import { verifyAccessToken } from '../utils/access-token'
import { generateErrorStatus } from '../utils/rest-status'

const checkAuth = async (req, res, next) => {
  const accessToken = req.query.accessToken
  if (!(await verifyAccessToken(accessToken)))
    res.status(401).json(generateErrorStatus('UNAUTHORIZED'))

  next()
}

export default checkAuth

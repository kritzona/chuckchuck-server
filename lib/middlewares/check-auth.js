import { verifyAccessToken } from '../utils/access-token'
import { generateErrorStatus } from '../utils/rest-status'

const checkAuth = async (req, res, next) => {
  const headerAuth = req.headers.authorization
  const [authType, authUserAccessToken] = headerAuth.split(' ')
  if (!authType === 'Bearer' || !(await verifyAccessToken(authUserAccessToken)))
    return res.status(401).json(generateErrorStatus('UNAUTHORIZED'))

  next()
}

export default checkAuth

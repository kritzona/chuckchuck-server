import {
  generateErrorStatus,
  generateSuccessStatus,
} from '../utils/rest-status'
import { verifyAccessToken } from '../utils/access-token'
import UserModel from '../models/user.model'

const fetchSelfService = async (req, res) => {
  const accessToken = req.query.accessToken
  const accessTokenData = await verifyAccessToken(accessToken)
  const userId = accessTokenData ? accessTokenData.userId : null
  const foundUser = await UserModel.findById(userId).exec()

  if (foundUser) {
    res.status(200).json(
      generateSuccessStatus({
        item: {
          id: foundUser._id,
          login: foundUser.login,
          firstName: foundUser.firstName,
          lastName: foundUser.lastName,
          age: foundUser.age,
          city: foundUser.city,
          about: foundUser.about,
          createdAt: foundUser.createdAt,
        },
      }),
    )
  } else {
    res.status(401).json(generateErrorStatus('UNAUTHORIZED'))
  }
}

export default fetchSelfService

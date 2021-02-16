import { generateErrorStatus } from '../utils/rest-status'

const userCreateValidation = (req, res, next) => {
  const errors = validationResult(req)
  if (errors && !errors.isEmpty())
    req.status(200).json(generateErrorStatus('INVALID_DATA'))

  next()
}

export default userCreateValidation

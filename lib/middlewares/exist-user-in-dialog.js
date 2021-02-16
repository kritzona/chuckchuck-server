import DialogModel from '../models/dialog.model'
import { generateErrorStatus } from '../utils/rest-status'

const existUserInDialog = async (req, res, next) => {
  const dialogId = req.params.id
  const userId = req.query.userId

  const existUserInDialog = await DialogModel.exists({
    _id: mongoose.Types.ObjectId(dialogId),
    users: mongoose.Types.ObjectId(userId),
  })
  if (!existUserInDialog)
    return res.status(200).json(generateErrorStatus('USER_NOT_EXIST_IN_DIALOG'))

  next()
}

export default existUserInDialog

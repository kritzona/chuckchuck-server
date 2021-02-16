import DialogModel from '../models/dialog.model'
import { generateErrorStatus } from '../utils/rest-status'
import mongoose from 'mongoose'

const existUserInDialog = async (req, res, next) => {
  const dialogId = req.params.id
  const userId = req.query.userId

  const _existUserInDialog = await DialogModel.exists({
    _id: mongoose.Types.ObjectId(dialogId),
    users: mongoose.Types.ObjectId(userId),
  })
  if (!_existUserInDialog)
    return res.status(200).json(generateErrorStatus('USER_NOT_EXIST_IN_DIALOG'))

  next()
}

export default existUserInDialog

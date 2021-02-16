import DialogModel from '../models/dialog.model'
import { generateErrorStatus } from '../utils/rest-status'
import mongoose from 'mongoose'

const existDialog = async (req, res, next) => {
  const dialogId = req.params.id

  const _existDialog = await DialogModel.exists({
    _id: mongoose.Types.ObjectId(dialogId),
  })
  if (!_existDialog)
    return res.status(410).json(generateErrorStatus('DIALOG_NOT_EXIST'))

  next()
}

export default existDialog

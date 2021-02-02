import {
  generateErrorStatus,
  generateSuccessStatus,
} from '../utils/rest-status'

class RootController {
  constructor(model) {
    this._model = model

    this.index = this.index.bind(this)
    this.store = this.store.bind(this)
    this.show = this.show.bind(this)
    this.create = this.create.bind(this)
    this.edit = this.edit.bind(this)
    this.destroy = this.destroy.bind(this)
  }

  async index(req, res) {
    await this.store(req, res)
  }
  async store(req, res) {
    await this._model.find({}, (err, items) => {
      if (!err) {
        res.status(200).json(generateSuccessStatus({ items }))
      } else {
        res.status(200).json(generateErrorStatus(err))
      }
    })
  }
  async show(req, res) {
    const id = req.params.id

    await this._model.findById(id, (err, item) => {
      if (!err) {
        res.status(200).json(generateSuccessStatus({ item }))
      } else {
        res.status(200).json(generateErrorStatus('USER_NOT_FOUND'))
      }
    })
  }
  async create(req, res) {}
  async edit(req, res) {
    const id = req.params.id

    res.status(200).json(generateSuccessStatus({}))
  }
  async destroy(req, res) {
    const id = req.params.id

    await this._model.findByIdAndDelete(id, {}, (err) => {
      if (!err) {
        res.status(410).json(generateSuccessStatus({}))
      } else {
        res.status(200).json(generateErrorStatus(err))
      }
    })
  }
  async destroyAll(req, res) {
    await this._model.deleteMany({}, {}, (err) => {
      if (!err) {
        res.status(410).json(generateSuccessStatus({}))
      } else {
        res.status(200).json(generateErrorStatus(err))
      }
    })
  }
}

export default RootController

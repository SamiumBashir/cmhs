import Settings from '../models/Settings.js'
import BaseService from '../services/baseService.js'

class SettingsService extends BaseService {
  constructor() {
    super(Settings)
  }

  async getOrCreate() {
    let settings = await this.model.findOne().exec()
    if (!settings) {
      settings = await this.model.create({})
    }
    return settings
  }

  async updateSettings(data) {
    const updateData = { ...data }
    delete updateData._id
    delete updateData.createdAt
    delete updateData.updatedAt
    delete updateData.__v

    const settings = await this.model.findOneAndUpdate(
      {},
      { $set: updateData },
      { new: true, upsert: true, runValidators: true }
    ).exec()
    return settings
  }
}

const settingsService = new SettingsService()

export { settingsService }

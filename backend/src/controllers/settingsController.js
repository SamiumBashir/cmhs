import { asyncHandler } from './baseController.js'
import { settingsService } from '../services/settingsService.js'

const getSettings = asyncHandler(async (req, res) => {
  const settings = await settingsService.getOrCreate()
  res.json({ success: true, data: settings })
})

const updateSettings = asyncHandler(async (req, res) => {
  const settings = await settingsService.updateSettings(req.body)
  res.json({ success: true, data: settings })
})

const settingsController = {
  getSettings,
  updateSettings
}

export { settingsController }

import { asyncHandler } from './baseController.js'
import { settingsService } from '../services/settingsService.js'
import { clearCache } from '../middleware/cache.js'
import { auditLogService } from '../services/auditLogService.js'

const getSettings = asyncHandler(async (req, res) => {
  const settings = await settingsService.getOrCreate()
  res.json({ success: true, data: settings })
})

const updateSettings = asyncHandler(async (req, res) => {
  const settings = await settingsService.updateSettings(req.body)
  await clearCache('settings:*')
  if (req.user) {
    await auditLogService.logAction({
      user: req.user,
      action: 'UPDATE',
      resource: 'Settings',
      recordId: settings._id,
      details: { body: req.body },
      req
    })
  }
  res.json({ success: true, data: settings })
})

const settingsController = {
  getSettings,
  updateSettings
}

export { settingsController }

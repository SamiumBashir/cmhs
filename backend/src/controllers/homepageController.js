import { asyncHandler } from './baseController.js'
import { homepageService } from '../services/homepageService.js'
import { clearCache } from '../middleware/cache.js'
import { auditLogService } from '../services/auditLogService.js'

const getHomepage = asyncHandler(async (req, res) => {
  const homepage = await homepageService.getOrCreate()
  res.json({ success: true, data: homepage })
})

const updateHomepage = asyncHandler(async (req, res) => {
  const homepage = await homepageService.updateHomepage(req.body)
  await clearCache('homepage:*')
  if (req.user) {
    await auditLogService.logAction({
      user: req.user,
      action: 'UPDATE',
      resource: 'Homepage',
      recordId: homepage._id,
      details: { body: req.body },
      req
    })
  }
  res.json({ success: true, data: homepage })
})

export const homepageController = {
  getHomepage,
  updateHomepage
}

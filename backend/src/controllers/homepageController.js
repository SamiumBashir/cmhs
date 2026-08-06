import { asyncHandler } from './baseController.js'
import { homepageService } from '../services/homepageService.js'

const getHomepage = asyncHandler(async (req, res) => {
  const homepage = await homepageService.getOrCreate()
  res.json({ success: true, data: homepage })
})

const updateHomepage = asyncHandler(async (req, res) => {
  const homepage = await homepageService.updateHomepage(req.body)
  res.json({ success: true, data: homepage })
})

export const homepageController = {
  getHomepage,
  updateHomepage
}

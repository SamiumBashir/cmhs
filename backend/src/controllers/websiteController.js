import { asyncHandler } from './baseController.js'
import { settingsService } from '../services/settingsService.js'

const getWebsiteInfo = asyncHandler(async (req, res) => {
  const settings = await settingsService.getOrCreate()
  res.json({ success: true, data: settings })
})

const getNavigation = asyncHandler(async (req, res) => {
  const nav = [
    { path: '/', label: { bn: 'হোম', en: 'Home' } },
    { path: '/about', label: { bn: 'আমাদের সম্পর্কে', en: 'About Us' } },
    { path: '/academics', label: { bn: 'শিক্ষা কার্যক্রম', en: 'Academics' } },
    { path: '/admission', label: { bn: 'ভর্তি', en: 'Admission' } },
    { path: '/examination', label: { bn: 'পরীক্ষা', en: 'Examination' } },
    { path: '/campus-life', label: { bn: 'ক্যাম্পাস লাইফ', en: 'Campus Life' } },
    { path: '/notice-board', label: { bn: 'নোটিশ বোর্ড', en: 'Notice Board' } },
    { path: '/contact', label: { bn: 'যোগাযোগ', en: 'Contact' } }
  ]
  res.json({ success: true, data: nav })
})

const websiteController = {
  getWebsiteInfo,
  getNavigation
}

export { websiteController }

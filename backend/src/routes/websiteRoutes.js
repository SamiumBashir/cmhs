import express from 'express'
import { websiteController } from '../controllers/websiteController.js'

const router = express.Router()

router.get('/info', websiteController.getWebsiteInfo)
router.get('/navigation', websiteController.getNavigation)

export default router


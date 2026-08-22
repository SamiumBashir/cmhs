import express from 'express'
import auth from '../middleware/auth.js'
import { settingsController } from '../controllers/settingsController.js'

const router = express.Router()

router.get('/', settingsController.getSettings)
router.put('/', auth(['super_admin', 'admin']), settingsController.updateSettings)

export default router

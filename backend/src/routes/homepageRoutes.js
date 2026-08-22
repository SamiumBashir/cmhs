import express from 'express'
import auth from '../middleware/auth.js'
import { homepageController } from '../controllers/homepageController.js'

const router = express.Router()

router.get('/', homepageController.getHomepage)
router.put('/', auth(['super_admin', 'admin', 'editor']), homepageController.updateHomepage)

export default router

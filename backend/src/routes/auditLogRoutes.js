import express from 'express'
import auth from '../middleware/auth.js'
import { auditLogController } from '../controllers/auditLogController.js'

const router = express.Router()

router.get('/', auth(['super_admin', 'admin']), auditLogController.getAll)
router.get('/:id', auth(['super_admin', 'admin']), auditLogController.getOne)

export default router

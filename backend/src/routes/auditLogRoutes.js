import express from 'express'
import auth from '../middleware/auth.js'
import { auditLogController } from '../controllers/auditLogController.js'

const router = express.Router()

router.use(auth(['super_admin']))

router.get('/', auditLogController.getAll)
router.get('/:id', auditLogController.getOne)

export default router

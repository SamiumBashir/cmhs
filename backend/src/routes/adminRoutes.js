import express from 'express'
import auth from '../middleware/auth.js'
import { adminUserController } from '../controllers/adminUserController.js'

const router = express.Router()

// All administrative user management routes require super_admin or admin
router.use(auth(['super_admin', 'admin']))

router.get('/', adminUserController.getAll)
router.get('/:id', adminUserController.getOne)
router.post('/', adminUserController.create)
router.put('/:id', adminUserController.update)
router.delete('/:id', auth(['super_admin']), adminUserController.remove)

export default router

import express from 'express'
import auth from '../middleware/auth.js'
import { staffController } from '../controllers/staffController.js'

const router = express.Router()

// Public endpoints to view staff members
router.get('/', staffController.getAll)
router.get('/:id', staffController.getOne)

// Administrative mutations restricted to super_admin and admin
router.post('/', auth(['super_admin', 'admin']), staffController.create)
router.put('/:id', auth(['super_admin', 'admin']), staffController.update)
router.delete('/:id', auth(['super_admin', 'admin']), staffController.remove)

export default router

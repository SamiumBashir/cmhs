import express from 'express'
import auth from '../middleware/auth.js'
import { classController } from '../controllers/classController.js'

const router = express.Router()

router.get('/', classController.getAll)
router.get('/:id', classController.getOne)

router.post('/', auth(['super_admin', 'admin']), classController.create)
router.put('/:id', auth(['super_admin', 'admin']), classController.update)
router.delete('/:id', auth(['super_admin', 'admin']), classController.remove)

export default router

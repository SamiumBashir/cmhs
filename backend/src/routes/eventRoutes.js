import express from 'express'
import auth from '../middleware/auth.js'
import { eventController } from '../controllers/eventController.js'

const router = express.Router()

router.get('/', eventController.getAll)
router.get('/:id', eventController.getOne)

router.post('/', auth(['super_admin', 'admin', 'editor', 'teacher']), eventController.create)
router.put('/:id', auth(['super_admin', 'admin', 'editor', 'teacher']), eventController.update)
router.delete('/:id', auth(['super_admin', 'admin']), eventController.remove)

export default router

import express from 'express'
import auth from '../middleware/auth.js'
import { routineController } from '../controllers/routineController.js'

const router = express.Router()

router.get('/', routineController.getAll)
router.get('/:id', routineController.getOne)

router.post('/', auth(['super_admin', 'admin', 'teacher']), routineController.create)
router.put('/:id', auth(['super_admin', 'admin', 'teacher']), routineController.update)
router.delete('/:id', auth(['super_admin', 'admin']), routineController.remove)

export default router

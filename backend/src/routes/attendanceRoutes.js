import express from 'express'
import auth from '../middleware/auth.js'
import { attendanceController } from '../controllers/attendanceController.js'

const router = express.Router()

router.get('/', auth, attendanceController.getAll)
router.get('/:id', auth, attendanceController.getOne)

router.post('/', auth(['super_admin', 'admin', 'teacher']), attendanceController.create)
router.put('/:id', auth(['super_admin', 'admin', 'teacher']), attendanceController.update)

export default router

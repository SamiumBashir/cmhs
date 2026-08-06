import express from 'express'
import { body } from 'express-validator'
import auth from '../middleware/auth.js'
import validate from '../middleware/validation.js'
import { attendanceController } from '../controllers/attendanceController.js'

const router = express.Router()

const attendanceValidation = [
  body('studentId').notEmpty().withMessage('Student ID is required'),
  body('class').notEmpty().withMessage('Class is required'),
  body('date').notEmpty().withMessage('Date is required'),
  body('status').isIn(['present', 'absent', 'late', 'excused']).withMessage('Invalid status')
]

router.get('/', auth, attendanceController.getAll)
router.get('/:id', auth, attendanceController.getOne)
router.post('/', auth, attendanceValidation, validate, attendanceController.create)
router.put('/:id', auth, attendanceController.update)

export default router


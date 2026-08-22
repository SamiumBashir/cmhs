import express from 'express'
import { body } from 'express-validator'
import auth from '../middleware/auth.js'
import validate from '../middleware/validation.js'
import { studentController } from '../controllers/studentController.js'

const router = express.Router()

const studentValidation = [
  body('name.bn').notEmpty().withMessage('Bengali name is required'),
  body('name.en').notEmpty().withMessage('English name is required'),
  body('class').notEmpty().withMessage('Class is required'),
  body('rollNumber').notEmpty().withMessage('Roll number is required'),
  body('section').optional(),
  body('gender').optional().isIn(['male', 'female', 'other']),
  body('status').optional().isIn(['active', 'inactive', 'graduated'])
]

router.get('/', auth(['super_admin', 'admin', 'teacher']), studentController.getAll)
router.get('/:id', auth, studentController.getOne)
router.post('/', auth(['super_admin', 'admin', 'teacher']), studentValidation, validate, studentController.create)
router.put('/:id', auth(['super_admin', 'admin', 'teacher']), studentController.update)
router.delete('/:id', auth(['super_admin', 'admin']), studentController.remove)

export default router

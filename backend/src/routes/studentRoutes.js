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

router.get('/', auth, studentController.getAll)
router.get('/:id', auth, studentController.getOne)
router.post('/', auth, studentValidation, validate, studentController.create)
router.put('/:id', auth, studentController.update)
router.delete('/:id', auth, studentController.remove)

export default router

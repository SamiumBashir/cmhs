import express from 'express'
import { body } from 'express-validator'
import auth from '../middleware/auth.js'
import validate from '../middleware/validation.js'
import { admissionController } from '../controllers/admissionController.js'

const router = express.Router()

const admissionValidation = [
  body('studentName.bn').notEmpty().withMessage('Bengali name is required'),
  body('studentName.en').notEmpty().withMessage('English name is required'),
  body('class').notEmpty().withMessage('Class is required'),
  body('phone').notEmpty().withMessage('Phone number is required')
]

// Public endpoint for prospective students/parents to submit applications
router.post('/', admissionValidation, validate, admissionController.create)

// Administrative management endpoints
router.get('/', auth(['super_admin', 'admin']), admissionController.getAll)
router.get('/:id', auth(['super_admin', 'admin']), admissionController.getOne)
router.put('/:id', auth(['super_admin', 'admin']), admissionController.update)
router.delete('/:id', auth(['super_admin', 'admin']), admissionController.remove)

export default router

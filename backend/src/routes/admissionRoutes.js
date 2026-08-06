import express from 'express'
import { body } from 'express-validator'
import auth from '../middleware/auth.js'
import validate from '../middleware/validation.js'
import { admissionController } from '../controllers/admissionController.js'

const router = express.Router()

const admissionValidation = [
  body('studentName.bn').notEmpty().withMessage('Bengali student name is required'),
  body('studentName.en').notEmpty().withMessage('English student name is required'),
  body('class').notEmpty().withMessage('Class is required'),
  body('status').optional().isIn(['pending', 'approved', 'rejected'])
]

router.get('/', auth, admissionController.getAll)
router.get('/:id', auth, admissionController.getOne)
router.post('/', admissionValidation, validate, admissionController.create)
router.put('/:id', auth, admissionController.update)
router.delete('/:id', auth, admissionController.remove)

export default router


import express from 'express'
import { body } from 'express-validator'
import auth from '../middleware/auth.js'
import validate from '../middleware/validation.js'
import { teacherController } from '../controllers/teacherController.js'

const router = express.Router()

const teacherValidation = [
  body('name.bn').notEmpty().withMessage('Bengali name is required'),
  body('name.en').notEmpty().withMessage('English name is required'),
  body('email').optional({ checkFalsy: true }).isEmail().withMessage('Valid email format required'),
  body('status').optional().isIn(['active', 'inactive'])
]

// Public endpoints to view teachers list
router.get('/', teacherController.getAll)
router.get('/:id', teacherController.getOne)

// Administrative mutations restricted to super_admin and admin
router.post('/', auth(['super_admin', 'admin']), teacherValidation, validate, teacherController.create)
router.put('/:id', auth(['super_admin', 'admin']), teacherController.update)
router.delete('/:id', auth(['super_admin', 'admin']), teacherController.remove)

export default router

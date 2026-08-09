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

router.get('/', auth, teacherController.getAll)
router.get('/:id', auth, teacherController.getOne)
router.post('/', auth, teacherValidation, validate, teacherController.create)
router.put('/:id', auth, teacherController.update)
router.delete('/:id', auth, teacherController.remove)

export default router


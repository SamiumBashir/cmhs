import express from 'express'
import { body } from 'express-validator'
import auth from '../middleware/auth.js'
import validate from '../middleware/validation.js'
import { staffController } from '../controllers/staffController.js'

const router = express.Router()

const staffValidation = [
  body('name.bn').notEmpty().withMessage('Bengali name is required'),
  body('name.en').notEmpty().withMessage('English name is required'),
  body('email').optional({ checkFalsy: true }).isEmail().withMessage('Valid email format required'),
  body('role').optional(),
  body('status').optional().isIn(['active', 'inactive'])
]

router.get('/', auth, staffController.getAll)
router.get('/:id', auth, staffController.getOne)
router.post('/', auth, staffValidation, validate, staffController.create)
router.put('/:id', auth, staffController.update)
router.delete('/:id', auth, staffController.remove)

export default router


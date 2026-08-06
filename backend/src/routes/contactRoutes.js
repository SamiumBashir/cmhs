import express from 'express'
import { body } from 'express-validator'
import auth from '../middleware/auth.js'
import validate from '../middleware/validation.js'
import { contactController } from '../controllers/contactController.js'

const router = express.Router()

const contactValidation = [
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('message').notEmpty().withMessage('Message is required'),
  body('status').optional().isIn(['new', 'read', 'replied'])
]

router.get('/', auth, contactController.getAll)
router.get('/:id', auth, contactController.getOne)
router.post('/', contactValidation, validate, contactController.create)
router.put('/:id', auth, contactController.update)
router.delete('/:id', auth, contactController.remove)

export default router


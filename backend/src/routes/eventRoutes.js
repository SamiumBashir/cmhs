import express from 'express'
import { body } from 'express-validator'
import auth from '../middleware/auth.js'
import validate from '../middleware/validation.js'
import { eventController } from '../controllers/eventController.js'

const router = express.Router()

const eventValidation = [
  body('title.bn').notEmpty().withMessage('Bengali title is required'),
  body('title.en').notEmpty().withMessage('English title is required'),
  body('date').notEmpty().withMessage('Date is required'),
  body('category').optional().isIn(['cultural', 'sports', 'academic', 'admin'])
]

router.get('/', eventController.getAll)
router.get('/:id', eventController.getOne)
router.post('/', auth, eventValidation, validate, eventController.create)
router.put('/:id', auth, eventController.update)
router.delete('/:id', auth, eventController.remove)

export default router


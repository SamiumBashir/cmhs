import express from 'express'
import { body } from 'express-validator'
import auth from '../middleware/auth.js'
import validate from '../middleware/validation.js'
import { routineController } from '../controllers/routineController.js'

const router = express.Router()

const routineValidation = [
  body('class').notEmpty().withMessage('Class is required'),
  body('day').notEmpty().withMessage('Day is required'),
  body('period').notEmpty().withMessage('Period is required'),
  body('subject').notEmpty().withMessage('Subject is required')
]

router.get('/', auth, routineController.getAll)
router.get('/:id', auth, routineController.getOne)
router.post('/', auth, routineValidation, validate, routineController.create)
router.put('/:id', auth, routineController.update)
router.delete('/:id', auth, routineController.remove)

export default router


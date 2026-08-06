import express from 'express'
import { body } from 'express-validator'
import auth from '../middleware/auth.js'
import validate from '../middleware/validation.js'
import { resultController } from '../controllers/resultController.js'

const router = express.Router()

const resultValidation = [
  body('studentId').notEmpty().withMessage('Student ID is required'),
  body('class').notEmpty().withMessage('Class is required'),
  body('exam').notEmpty().withMessage('Exam is required'),
  body('subject').notEmpty().withMessage('Subject is required'),
  body('marksObtained').notEmpty().withMessage('Marks obtained is required')
]

router.get('/', auth, resultController.getAll)
router.get('/student/:studentId', auth, resultController.getByStudent)
router.get('/:id', auth, resultController.getOne)
router.post('/', auth, resultValidation, validate, resultController.create)
router.put('/:id', auth, resultController.update)
router.delete('/:id', auth, resultController.remove)

export default router


import express from 'express'
import { body } from 'express-validator'
import auth from '../middleware/auth.js'
import validate from '../middleware/validation.js'
import { resultController } from '../controllers/resultController.js'

const router = express.Router()

const resultValidation = [
  body('student').notEmpty().withMessage('Student ID is required'),
  body('examName').notEmpty().withMessage('Exam name is required'),
  body('subject').notEmpty().withMessage('Subject is required'),
  body('marksObtained').isNumeric().withMessage('Marks obtained must be numeric'),
  body('fullMarks').isNumeric().withMessage('Full marks must be numeric')
]

router.get('/', resultController.getAll)
router.get('/student/:studentId', resultController.getByStudent)
router.get('/:id', resultController.getOne)

router.post('/', auth(['super_admin', 'admin', 'teacher']), resultValidation, validate, resultController.create)
router.put('/:id', auth(['super_admin', 'admin', 'teacher']), resultController.update)
router.delete('/:id', auth(['super_admin', 'admin']), resultController.remove)

export default router

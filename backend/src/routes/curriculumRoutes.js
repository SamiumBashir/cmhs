import express from 'express'
import { body } from 'express-validator'
import auth from '../middleware/auth.js'
import validate from '../middleware/validation.js'
import { curriculumController } from '../controllers/curriculumController.js'

const router = express.Router()

const curriculumValidation = [
  body('class').notEmpty().withMessage('Class is required'),
  body('subject').notEmpty().withMessage('Subject is required'),
  body('academicYear').notEmpty().withMessage('Academic year is required')
]

router.get('/', auth, curriculumController.getAll)
router.get('/:id', auth, curriculumController.getOne)
router.post('/', auth, curriculumValidation, validate, curriculumController.create)
router.put('/:id', auth, curriculumController.update)
router.delete('/:id', auth, curriculumController.remove)

export default router


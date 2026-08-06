import express from 'express'
import { body } from 'express-validator'
import auth from '../middleware/auth.js'
import validate from '../middleware/validation.js'
import { galleryController } from '../controllers/galleryController.js'

const router = express.Router()

const galleryValidation = [
  body('title.bn').notEmpty().withMessage('Bengali title is required'),
  body('title.en').notEmpty().withMessage('English title is required'),
  body('image').notEmpty().withMessage('Image URL is required'),
  body('category').optional().isIn(['campus', 'classroom', 'laboratory', 'library', 'sports', 'cultural', 'event'])
]

router.get('/', galleryController.getAll)
router.get('/:id', galleryController.getOne)
router.post('/', auth, galleryValidation, validate, galleryController.create)
router.put('/:id', auth, galleryController.update)
router.delete('/:id', auth, galleryController.remove)

export default router


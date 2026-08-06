import express from 'express'
import { body } from 'express-validator'
import auth from '../middleware/auth.js'
import validate from '../middleware/validation.js'
import { noticeController } from '../controllers/noticeController.js'

const router = express.Router()

const noticeValidation = [
  body('title.bn').notEmpty().withMessage('Bengali title is required'),
  body('title.en').notEmpty().withMessage('English title is required'),
  body('content.bn').notEmpty().withMessage('Bengali content is required'),
  body('content.en').notEmpty().withMessage('English content is required'),
  body('category').optional().isIn(['general', 'academic', 'admission', 'exam', 'result', 'event', 'holiday', 'admin', 'urgent'])
]

router.get('/', noticeController.getAll)
router.get('/:id', noticeController.getOne)
router.post('/', auth, noticeValidation, validate, noticeController.create)
router.put('/:id', auth, noticeController.update)
router.delete('/:id', auth, noticeController.remove)
router.get('/category/:category', noticeController.getByCategory)

export default router


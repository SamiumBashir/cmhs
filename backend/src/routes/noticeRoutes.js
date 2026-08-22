import express from 'express'
import { body } from 'express-validator'
import auth from '../middleware/auth.js'
import validate from '../middleware/validation.js'
import { noticeController } from '../controllers/noticeController.js'

const router = express.Router()

const noticeValidation = [
  body('title.bn').notEmpty().withMessage('Bengali title is required'),
  body('title.en').notEmpty().withMessage('English title is required'),
  body('category').optional().isIn(['general', 'academic', 'admission', 'exam', 'result', 'event', 'holiday', 'urgent']),
  body('status').optional().isIn(['published', 'draft', 'archived'])
]

router.get('/', noticeController.getAll)
router.get('/category/:category', noticeController.getByCategory)
router.get('/:id', noticeController.getOne)

router.post('/', auth(['super_admin', 'admin', 'teacher', 'editor']), noticeValidation, validate, noticeController.create)
router.put('/:id', auth(['super_admin', 'admin', 'teacher', 'editor']), noticeController.update)
router.delete('/:id', auth(['super_admin', 'admin']), noticeController.remove)

export default router

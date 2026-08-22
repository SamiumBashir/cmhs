import express from 'express'
import auth from '../middleware/auth.js'
import { faqController } from '../controllers/faqController.js'

const router = express.Router()

router.get('/', faqController.getAll)
router.get('/:id', faqController.getOne)

router.post('/', auth(['super_admin', 'admin', 'editor']), faqController.create)
router.put('/:id', auth(['super_admin', 'admin', 'editor']), faqController.update)
router.delete('/:id', auth(['super_admin', 'admin']), faqController.remove)

export default router

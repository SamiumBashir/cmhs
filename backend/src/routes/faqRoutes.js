import express from 'express'
import auth from '../middleware/auth.js'
import { faqController } from '../controllers/faqController.js'

const router = express.Router()

router.get('/', faqController.getAll)
router.get('/:id', faqController.getOne)
router.post('/', auth, faqController.create)
router.put('/:id', auth, faqController.update)
router.delete('/:id', auth, faqController.remove)

export default router

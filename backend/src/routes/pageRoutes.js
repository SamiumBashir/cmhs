import express from 'express'
import auth from '../middleware/auth.js'
import { pageController } from '../controllers/pageController.js'

const router = express.Router()

router.get('/', pageController.getAll)
router.get('/:id', pageController.getOne)

router.post('/', auth(['super_admin', 'admin', 'editor']), pageController.create)
router.put('/:id', auth(['super_admin', 'admin', 'editor']), pageController.update)
router.delete('/:id', auth(['super_admin', 'admin']), pageController.remove)

export default router

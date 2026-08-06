import express from 'express'
import auth from '../middleware/auth.js'
import { pageController } from '../controllers/pageController.js'

const router = express.Router()

router.get('/', pageController.getAll)
router.get('/:id', pageController.getOne)
router.post('/', auth, pageController.create)
router.put('/:id', auth, pageController.update)
router.delete('/:id', auth, pageController.remove)

export default router

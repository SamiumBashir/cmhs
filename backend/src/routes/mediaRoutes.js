import express from 'express'
import auth from '../middleware/auth.js'
import { mediaController } from '../controllers/mediaController.js'

const router = express.Router()

router.get('/', mediaController.getAll)
router.get('/:id', mediaController.getOne)
router.post('/', auth, mediaController.create)
router.put('/:id', auth, mediaController.update)
router.delete('/:id', auth, mediaController.remove)

export default router

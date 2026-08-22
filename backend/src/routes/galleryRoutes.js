import express from 'express'
import auth from '../middleware/auth.js'
import { galleryController } from '../controllers/galleryController.js'

const router = express.Router()

router.get('/', galleryController.getAll)
router.get('/:id', galleryController.getOne)

router.post('/', auth(['super_admin', 'admin', 'editor']), galleryController.create)
router.put('/:id', auth(['super_admin', 'admin', 'editor']), galleryController.update)
router.delete('/:id', auth(['super_admin', 'admin']), galleryController.remove)

export default router

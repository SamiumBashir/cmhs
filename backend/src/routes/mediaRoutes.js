import express from 'express'
import auth from '../middleware/auth.js'
import { mediaController, uploadMedia } from '../controllers/mediaController.js'
import { upload } from '../utils/upload.js'

const router = express.Router()

router.get('/', mediaController.getAll)
router.get('/:id', mediaController.getOne)
router.post('/upload', auth, upload.single('file'), uploadMedia)
router.post('/', auth, mediaController.create)
router.put('/:id', auth, mediaController.update)
router.delete('/:id', auth, mediaController.remove)

export default router

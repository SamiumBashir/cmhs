import express from 'express'
import auth from '../middleware/auth.js'
import {
  mediaController,
  uploadMedia,
  uploadDirect,
  getCloudinaryAssets,
  getCloudinaryStatus
} from '../controllers/mediaController.js'
import { upload } from '../utils/upload.js'

const router = express.Router()

router.get('/cloudinary/status', auth, getCloudinaryStatus)
router.get('/cloudinary', auth, getCloudinaryAssets)
router.post('/upload-direct', auth, uploadDirect)
router.post('/upload', auth, upload.single('file'), uploadMedia)

router.get('/', mediaController.getAll)
router.get('/:id', mediaController.getOne)
router.post('/', auth, mediaController.create)
router.put('/:id', auth, mediaController.update)
router.delete('/:id', auth, mediaController.remove)

export default router


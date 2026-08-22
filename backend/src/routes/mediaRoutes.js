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

router.get('/cloudinary/status', auth(['super_admin', 'admin', 'editor']), getCloudinaryStatus)
router.get('/cloudinary', auth(['super_admin', 'admin', 'editor']), getCloudinaryAssets)
router.post('/upload-direct', auth(['super_admin', 'admin', 'editor', 'teacher']), uploadDirect)
router.post('/upload', auth(['super_admin', 'admin', 'editor', 'teacher']), upload.single('file'), uploadMedia)

router.get('/', mediaController.getAll)
router.get('/:id', mediaController.getOne)
router.post('/', auth(['super_admin', 'admin', 'editor']), mediaController.create)
router.put('/:id', auth(['super_admin', 'admin', 'editor']), mediaController.update)
router.delete('/:id', auth(['super_admin', 'admin']), mediaController.remove)

export default router

import express from 'express'
import auth from '../middleware/auth.js'
import { downloadController } from '../controllers/downloadController.js'

const router = express.Router()

router.get('/', downloadController.getAll)
router.get('/:id', downloadController.getOne)
router.post('/', auth, downloadController.create)
router.put('/:id', auth, downloadController.update)
router.delete('/:id', auth, downloadController.remove)

export default router

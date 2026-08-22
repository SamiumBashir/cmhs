import express from 'express'
import auth from '../middleware/auth.js'
import { downloadController } from '../controllers/downloadController.js'

const router = express.Router()

router.get('/', downloadController.getAll)
router.get('/:id', downloadController.getOne)

router.post('/', auth(['super_admin', 'admin', 'editor']), downloadController.create)
router.put('/:id', auth(['super_admin', 'admin', 'editor']), downloadController.update)
router.delete('/:id', auth(['super_admin', 'admin']), downloadController.remove)

export default router

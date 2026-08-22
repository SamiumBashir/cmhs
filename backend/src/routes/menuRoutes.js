import express from 'express'
import auth from '../middleware/auth.js'
import { menuController } from '../controllers/menuController.js'

const router = express.Router()

router.get('/', menuController.getAll)
router.get('/:id', menuController.getOne)

router.post('/', auth(['super_admin', 'admin', 'editor']), menuController.create)
router.put('/:id', auth(['super_admin', 'admin', 'editor']), menuController.update)
router.delete('/:id', auth(['super_admin', 'admin']), menuController.remove)

export default router

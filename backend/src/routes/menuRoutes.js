import express from 'express'
import auth from '../middleware/auth.js'
import { menuController } from '../controllers/menuController.js'

const router = express.Router()

router.get('/', menuController.getAll)
router.get('/:id', menuController.getOne)
router.post('/', auth, menuController.create)
router.put('/:id', auth, menuController.update)
router.delete('/:id', auth, menuController.remove)

export default router

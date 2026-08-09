import express from 'express'
import auth from '../middleware/auth.js'
import { adminUserController } from '../controllers/adminUserController.js'

const router = express.Router()

router.get('/', auth, adminUserController.getAll)
router.get('/:id', auth, adminUserController.getOne)
router.post('/', auth, adminUserController.create)
router.put('/:id', auth, adminUserController.update)
router.delete('/:id', auth, adminUserController.remove)

export default router

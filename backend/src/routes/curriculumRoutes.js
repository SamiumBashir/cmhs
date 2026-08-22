import express from 'express'
import auth from '../middleware/auth.js'
import { curriculumController } from '../controllers/curriculumController.js'

const router = express.Router()

router.get('/', curriculumController.getAll)
router.get('/:id', curriculumController.getOne)

router.post('/', auth(['super_admin', 'admin']), curriculumController.create)
router.put('/:id', auth(['super_admin', 'admin']), curriculumController.update)
router.delete('/:id', auth(['super_admin', 'admin']), curriculumController.remove)

export default router

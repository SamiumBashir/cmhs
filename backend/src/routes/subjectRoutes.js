import express from 'express'
import auth from '../middleware/auth.js'
import { subjectController } from '../controllers/subjectController.js'

const router = express.Router()

router.get('/', subjectController.getAll)
router.get('/:id', subjectController.getOne)

router.post('/', auth(['super_admin', 'admin']), subjectController.create)
router.put('/:id', auth(['super_admin', 'admin']), subjectController.update)
router.delete('/:id', auth(['super_admin', 'admin']), subjectController.remove)

export default router

import express from 'express'
import { subjectController } from '../controllers/subjectController.js'
import auth from '../middleware/auth.js'

const router = express.Router()

router.use(auth())

router.route('/')
  .get(subjectController.getAll)
  .post(subjectController.create)

router.route('/:id')
  .get(subjectController.getOne)
  .put(subjectController.update)
  .delete(subjectController.remove)

export default router

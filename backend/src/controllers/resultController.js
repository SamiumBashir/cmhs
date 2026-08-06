import { createController, asyncHandler } from './baseController.js'
import { resultService } from '../services/resultService.js'

const ResultControllerObj = createController(resultService, {
  populate: ['studentId'],
  sort: { createdAt: -1 }
})

const getByStudent = asyncHandler(async (req, res) => {
  const { exam, academicYear } = req.query
  const results = await resultService.getByStudent(req.params.studentId, exam, academicYear)
  res.json({ success: true, data: results })
})

const resultController = {
  ...ResultControllerObj,
  getByStudent
}

export { resultController }

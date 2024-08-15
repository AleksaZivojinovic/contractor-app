import express from 'express'

import { getUnpaidJobs, payJob } from '@controllers/jobs'

const router = express.Router()

router.get('/unpaid', getUnpaidJobs)
router.post('/:job_id/pay', payJob)

export default router

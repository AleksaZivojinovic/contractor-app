import express from 'express'

import { getProfile } from '@middlewares/getProfile'
import contracts from './contracts'
import jobs from './jobs'
import balances from './balances'
import admin from './admin'

const router = express.Router()

router.use('/admin', admin)
router.use(getProfile)
router.use('/contracts', contracts)
router.use('/jobs', jobs)
router.use('/balances', balances)

export default router

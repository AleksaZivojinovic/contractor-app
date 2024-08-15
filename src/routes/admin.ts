import express from 'express'

import { getBestProfession, getBestClients, test } from '@controllers/admin'

const router = express.Router()

router.get('/best-profession', getBestProfession)
router.get('/best-clients', getBestClients)
router.get('/test', test)

export default router

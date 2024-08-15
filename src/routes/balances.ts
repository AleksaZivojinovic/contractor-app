import express from 'express'

import { depositBalance } from '@controllers/balances'

const router = express.Router()

router.post('/deposit', depositBalance)

export default router

import express from 'express'

import { getContractById, getContracts } from '@controllers/contracts'

const router = express.Router()

router.get('/', getContracts)
router.get('/:id', getContractById)

export default router

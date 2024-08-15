import { Request, Response, NextFunction } from 'express'
import { Op } from 'sequelize'

import Contract from '@models/Contract'

/**
 * FIX ME!
 * @returns contract by id
 */
export const getContractById = async (
	req: Request,
	res: Response,
	next: NextFunction
): Promise<void> => {
	try {
		const { id } = req.params
		const { id: profileId } = req.profile

		const contract = await Contract.findOne({
			where: {
				id,
				[Op.or]: { ClientId: profileId, ContractorId: profileId }
			}
		})
		if (!contract) return res.status(404).end()

		res.status(200).json(contract)
	} catch (error) {
		next(error)
	}
}

/**
 * @returns all contracts from current profile
 */
export const getContracts = async (
	req: Request,
	res: Response,
	next: NextFunction
): Promise<void> => {
	try {
		const { id: profileId } = req.profile

		const contracts = await Contract.findAll({
			where: {
				status: {
					[Op.not]: 'terminated'
				},
				[Op.or]: { ClientId: profileId, ContractorId: profileId }
			}
		})
		if (!contracts) return res.status(404).end()

		res.status(200).json(contracts)
	} catch (error) {
		next(error)
	}
}

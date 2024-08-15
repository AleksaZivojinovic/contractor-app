import { Request, Response, NextFunction } from 'express'
import { Op } from 'sequelize'

import { sequelize } from '@config/sequelize'
import { validateDateParams } from '@services/admin'
import { IJobWithEarings } from '@definedTypes/jobs'

import Contract from '@models/Contract'
import Job from '@models/Job'
import Profile from '@models/Profile'

export const test = async (
	req: Request,
	res: Response,
	next: NextFunction
): Promise<void> => {
	try {
		const user = await Profile.findAll({
			include: { model: Contract, as: 'Contractor' }
		})

		res.send(user)
	} catch (error) {
		next(error)
	}
}

/**
 * @returns most paid job
 */
export const getBestProfession = async (
	req: Request,
	res: Response,
	next: NextFunction
): Promise<void> => {
	try {
		const { start, end } = req.query
		const { errorMessage, startDate, endDate } = await validateDateParams(start, end)
		if (errorMessage) return res.status(400).send({ errorMessage, startDate, endDate })

		const bestProfession: IJobWithEarings | null = await Job.findOne({
			attributes: [
				[sequelize.fn('SUM', sequelize.col('price')), 'totalEarnings'],
				'Contract->Contractor.profession'
			],
			where: {
				paymentDate: {
					[Op.between]: [startDate, endDate]
				}
			},
			include: {
				model: Contract,
				as: 'Contract',
				attributes: [],
				include: {
					model: Profile,
					as: 'Contractor'
					// attributes: ['profession']
				} as any
			},
			group: ['Contract->Contractor.profession'],
			order: [[sequelize.literal('totalEarnings'), 'DESC']],
			raw: true
		})

		if (!bestProfession)
			return res.status(404).send('There are no jobs in the requested period!')

		console.log('Best profession: ', bestProfession)

		const { profession, totalEarnings } = bestProfession
		return res.status(200).send({
			profession,
			totalEarnings
		})
	} catch (error) {
		next(error)
	}
}

/**
 * @returns array of best clients
 */
export const getBestClients = async (
	req: Request,
	res: Response,
	next: NextFunction
): Promise<void> => {
	try {
		const { start, end, limit } = req.query
		const { errorMessage, startDate, endDate } = await validateDateParams(start, end)
		if (errorMessage) return res.status(400).send({ errorMessage, startDate, endDate })

		const clientLimit = limit ? parseInt(limit as string, 10) : 2
		if (typeof clientLimit !== 'number' || isNaN(clientLimit))
			return res.status(422).send('Limit parameter must be a valid number')

		const bestClients = await Job.findAll({
			attributes: [
				[sequelize.fn('SUM', sequelize.col('price')), 'totalPaid'],
				[
					sequelize.fn(
						'concat',
						sequelize.col('Contract->Client.firstName'),
						' ',
						sequelize.col('Contract->Client.lastName')
					),
					'fullName'
				],
				'Contract.Client.id'
			],
			where: {
				paymentDate: {
					[Op.between]: [startDate, endDate]
				}
			},
			include: {
				model: Contract,
				as: 'Contract',
				attributes: [],
				include: {
					model: Profile,
					as: 'Client',
					attributes: ['id', 'firstName', 'lastName']
				} as any
			},
			group: [
				'Contract.Client.id',
				'Contract.Client.firstName',
				'Contract.Client.lastName'
			],
			order: [[sequelize.fn('SUM', sequelize.col('price')), 'DESC']],
			limit: clientLimit
		})

		if (!bestClients.length)
			return res.status(404).send('No clients found in the requested period.')

		const formattedClients = bestClients.map((client) => ({
			id: client['Contract.Client.id'],
			fullName: client['fullName'],
			paid: client['totalPaid']
		}))

		return res.status(200).json(formattedClients)
	} catch (error) {
		next(error)
	}
}

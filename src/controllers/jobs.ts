import { Request, Response, NextFunction } from 'express'

import Contract from '@models/Contract'
import Job from '@models/Job'
import Profile from '@models/Profile'
import { processPayTransaction } from '@services/jobs'

/**
 * @returns array of unpaid jobs with active contracts
 */
export const getUnpaidJobs = async (
	req: Request,
	res: Response,
	next: NextFunction
): Promise<void> => {
	try {
		console.log('Getting unpaid jobs!')
		const { id, type } = req.profile
		const capitalizedType = type.charAt(0).toUpperCase() + type.slice(1)

		const jobs = await Job.findAll({
			attributes: ['id', 'description', 'price', 'paid', 'paymentDate', 'ContractId'],
			where: {
				paid: false
			},
			include: {
				model: Contract,
				attributes: [],
				required: true,
				where: { status: 'in_progress' },
				as: 'Contract',
				include: {
					model: Profile,
					as: capitalizedType,
					where: {
						id
					}
				} as any
			}
		})

		return res.status(200).json(jobs)
	} catch (error) {
		next(error)
	}
}

/**
 * @returns message if job payment is successfully proceeded
 */
export const payJob = async (
	req: Request,
	res: Response,
	next: NextFunction
): Promise<void> => {
	try {
		const { job_id: id } = req.params
		const { profile } = req

		if (profile.type !== 'client')
			return res.status(422).send('Only clients can pay their jobs jobs!')

		await processPayTransaction(profile.id, +id)

		return res.status(200).send('Job paid successfully!')
	} catch (error) {
		next(error)
	}
}

import { Transaction } from 'sequelize'

import { sequelize } from '@config/sequelize'
import { IJobWithSum } from '@definedTypes/jobs'

import Contract from '@models/Contract'
import Job from '@models/Job'
import Profile from '@models/Profile'

export const processDepositTransaction = async (profileId: number, deposit: number) =>
	await sequelize.transaction(async (t) => {
		const client = await Profile.findByPk(profileId, {
			lock: Transaction.LOCK.UPDATE,
			transaction: t
		})
		if (client.type !== 'client') throw new Error('Only Clients can deposit money')

		const unpaidJobsSum: IJobWithSum | null = await Job.findOne({
			attributes: [[sequelize.fn('SUM', sequelize.col('price')), 'total']],
			include: {
				model: Contract,
				as: 'Contract',
				where: {
					ClientId: client.id,
					status: 'in_progress'
				}
			},
			where: {
				paid: false
			},
			transaction: t,
			raw: true
		})

		const totalUnpaidJobs = unpaidJobsSum.total || 0
		const maxDepositAmount = totalUnpaidJobs * 0.25

		console.log({ totalUnpaidJobs, maxDepositAmount })

		if (deposit > maxDepositAmount)
			throw new Error(
				`Deposit amount exceeds the allowed 25% of total unpaid jobs. Maximum allowed: ${maxDepositAmount}`
			)

		await client.increment('balance', { by: deposit, transaction: t })
	})

import { Transaction } from 'sequelize'

import { sequelize } from '@config/sequelize'
import Contract from '@models/Contract'
import Job from '@models/Job'
import Profile from '@models/Profile'

export const processPayTransaction = async (
	profileId: number,
	jobId: number
): Promise<void> =>
	await sequelize.transaction(async (t) => {
		const client = await Profile.findByPk(profileId, {
			lock: Transaction.LOCK.UPDATE,
			transaction: t
		})
		if (!client) throw new Error('Client not found')

		const job = await Job.findByPk(jobId, {
			lock: Transaction.LOCK.UPDATE,
			transaction: t
		})
		if (!job) throw new Error('Job not found')

		const contract = await Contract.findOne({
			where: {
				id: job.ContractId,
				ClientId: client.id
			},
			lock: Transaction.LOCK.UPDATE,
			transaction: t
		})

		if (!contract) throw new Error('Contract from job does not belong to client')
		if (contract.status !== 'in_progress') throw new Error('Contract is active')

		if (job.paid) throw new Error('Job already paid')
		if (client.balance < job.price)
			throw new Error('Client does not have sufficient funds to pay this job!')

		const contractor = await Profile.findByPk(contract.ContractorId, {
			lock: Transaction.LOCK.UPDATE,
			transaction: t
		})
		if (!contractor) throw new Error('Contractor not found')

		await client.decrement('balance', { by: job.price, transaction: t })
		await contractor.increment('balance', { by: job.price, transaction: t })

		job.paid = true
		job.paymentDate = new Date(Date.now())
		await job.save({ transaction: t })
	})

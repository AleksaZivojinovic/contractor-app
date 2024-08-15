import { Request, Response, NextFunction } from 'express'

import { processDepositTransaction } from '@services/balances'

/**
 * @returns message if deposit is successfully placed and new balance
 */
export const depositBalance = async (
	req: Request,
	res: Response,
	next: NextFunction
): Promise<any> => {
	try {
		const { profile, body } = req
		const { deposit } = body

		if (typeof deposit !== 'number' || isNaN(deposit))
			return res.status(422).send('Deposit parameter must be a valid number')

		await processDepositTransaction(profile.id, deposit)

		res
			.status(200)
			.send({ message: 'Deposit successful', newBalance: profile.balance + deposit })
	} catch (error) {
		next(error)
	}
}

import { Request, Response, NextFunction } from 'express'

import Profile from '@models/Profile'

const getProfile = async (
	req: Request,
	res: Response,
	next: NextFunction
): Promise<void> => {
	const profile = await Profile.findOne({ where: { id: req.get('profile_id') || 0 } })
	if (!profile) return res.status(401).end()

	req.profile = profile
	next()
}
export { getProfile }

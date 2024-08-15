import { IValidateDateResponse } from '@definedTypes/admin'

export const validateDateParams = (start: string, end: string): IValidateDateResponse => {
	if (!start || !end)
		return {
			errorMessage: 'Query parameters "start" and "end" are required',
			startDate: new Date(start),
			endDate: new Date(end)
		}

	const startDate = new Date(start)
	const endDate = new Date(end)

	if (isNaN(startDate.getTime()) || isNaN(endDate.getTime()))
		return { errorMessage: 'Invalid date format', startDate, endDate }

	return { errorMessage: '', startDate, endDate }
}

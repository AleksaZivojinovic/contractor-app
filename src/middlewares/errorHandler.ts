import { Request, Response, NextFunction } from 'express'

export const errorHandler = (
	err: Error,
	req: Request,
	res: Response,
	next: NextFunction
): void => {
	console.error(`\x1b[31mError in route: ${req.originalUrl}`)
	console.error('Stack', err.stack)
	console.error('Error message: ', err.message)

	return err.message
		? res.status(400).send(err.message)
		: res.status(500).send('Something went wrong!')
}

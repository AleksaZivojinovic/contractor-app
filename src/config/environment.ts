import dotenv from 'dotenv'

import { IEnvironment } from '@definedTypes/environment'

dotenv.config()

const { PORT } = process.env

const environment: IEnvironment = {
	port: PORT
}

export default environment

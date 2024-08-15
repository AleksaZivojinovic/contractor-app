import express, { Application } from 'express'

import { sequelize } from './models'
import routes from './routes/index'
import { errorHandler } from '@middlewares/errorHandler'

const app: Application = express()
app.use(express.json())

app.set('sequelize', sequelize)
app.set('models', sequelize.models)

app.use(routes)

app.use(errorHandler)

export default app

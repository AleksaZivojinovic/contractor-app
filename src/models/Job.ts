import {
	Sequelize,
	Model,
	DataTypes,
	InferAttributes,
	InferCreationAttributes,
	CreationOptional,
	NonAttribute,
	ForeignKey
} from 'sequelize'
import Contract from './Contract'

class Job extends Model<
	InferAttributes<Job, { omit: 'Contract' }>,
	InferCreationAttributes<Job, { omit: 'Contract' }>
> {
	declare id: CreationOptional<number>
	declare description: string
	declare price: number
	declare paid: boolean
	declare paymentDate: Date
	declare Contract: NonAttribute<Contract>
	declare ContractId: ForeignKey<Contract['id']>
}

export const initJobModel = (sequelize: Sequelize): void => {
	Job.init(
		{
			id: {
				type: DataTypes.INTEGER,
				autoIncrement: true,
				primaryKey: true
			},
			description: {
				type: DataTypes.TEXT,
				allowNull: false
			},
			price: {
				type: DataTypes.DECIMAL(12, 2),
				allowNull: false
			},
			paid: {
				type: DataTypes.BOOLEAN,
				defaultValue: false
			},
			paymentDate: {
				type: DataTypes.DATE
			}
		},
		{
			sequelize,
			modelName: 'Job'
		}
	)
}

export default Job

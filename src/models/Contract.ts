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
import Profile from './Profile'

class Contract extends Model<
	InferAttributes<Contract, { omit: 'Client' }>,
	InferCreationAttributes<Contract, { omit: 'Client' }>
> {
	declare id: CreationOptional<number>
	declare terms: string
	declare status: 'new' | 'in_progress' | 'terminated'
	declare Client?: NonAttribute<Profile>
	declare ClientId: ForeignKey<Profile['id']>
	declare Contractor?: NonAttribute<Profile>
	declare ContractorId: ForeignKey<Profile['id']>
}

export const initContractModel = (sequelize: Sequelize): void => {
	Contract.init(
		{
			id: {
				type: DataTypes.INTEGER,
				autoIncrement: true,
				primaryKey: true
			},
			terms: {
				type: DataTypes.TEXT,
				allowNull: false
			},
			status: {
				type: DataTypes.ENUM('new', 'in_progress', 'terminated')
			}
		},
		{
			sequelize,
			modelName: 'Contract'
		}
	)
}

export default Contract

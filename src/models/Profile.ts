import {
	Sequelize,
	Model,
	DataTypes,
	InferAttributes,
	InferCreationAttributes,
	CreationOptional
} from 'sequelize'

class Profile extends Model<InferAttributes<Profile>, InferCreationAttributes<Profile>> {
	declare id: CreationOptional<number>
	declare firstName: string
	declare lastName: string
	declare profession: string
	declare balance: number
	declare type: 'client' | 'contractor'
}

export const initProfileModel = (sequelize: Sequelize): void => {
	Profile.init(
		{
			id: {
				type: DataTypes.INTEGER,
				autoIncrement: true,
				primaryKey: true
			},
			firstName: {
				type: DataTypes.STRING,
				allowNull: false
			},
			lastName: {
				type: DataTypes.STRING,
				allowNull: false
			},
			profession: {
				type: DataTypes.STRING,
				allowNull: false
			},
			balance: {
				type: DataTypes.DECIMAL(12, 2),
				allowNull: false,
				defaultValue: 0
			},
			type: {
				type: DataTypes.ENUM('client', 'contractor'),
				allowNull: false
			}
		},
		{
			sequelize,
			modelName: 'Profile'
		}
	)
}

export default Profile

import { sequelize } from '@config/sequelize'
import Profile, { initProfileModel } from '@models/Profile'
import Contract, { initContractModel } from '@models/Contract'
import Job, { initJobModel } from '@models/Job'

initProfileModel(sequelize)
initContractModel(sequelize)
initJobModel(sequelize)

Profile.hasMany(Contract, { as: 'Contractor', foreignKey: 'ContractorId' })
Contract.belongsTo(Profile, { as: 'Contractor' })
Profile.hasMany(Contract, { as: 'Client', foreignKey: 'ClientId' })
Contract.belongsTo(Profile, { as: 'Client' })
Contract.hasMany(Job)
Job.belongsTo(Contract)

export { sequelize, Profile, Contract, Job }

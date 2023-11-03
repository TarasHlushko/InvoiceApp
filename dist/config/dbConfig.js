import { Sequelize } from 'sequelize';
import UserSchema from '../models/user.js';
import CompanySchema from '../models/company.js';
import ClientSchema from '../models/Clients.js';
import InvoiceSchema from '../models/invoices.js';
import InvoiceItemSchema from '../models/invoiceItems.js';
import CompanyMemberSchema from '../models/companyMember.js';
import CompanyMemberInvitationSchema from '../models/companyMemberInvitation.js';
import dotenv from 'dotenv';
dotenv.config();
export const sequelize = new Sequelize(process.env.DATABASE_NAME, process.env.DATABASE_USERNAME, process.env.DATABASE_PASSWORD, {
    host: process.env.DATABASE_HOST,
    dialect: 'postgres',
    logging: false,
});
// const sequelize = new Sequelize(
//   'postgres://qgpwtccq:RLHmN6JRg1bsJGJBmHELVPtCtwrN1OhD@trumpet.db.elephantsql.com/qgpwtccq'
// );
export const User = UserSchema(sequelize);
export const Company = CompanySchema(sequelize);
export const Client = ClientSchema(sequelize);
export const Invoice = InvoiceSchema(sequelize);
export const InvoiceItems = InvoiceItemSchema(sequelize);
export const CompanyMember = CompanyMemberSchema(sequelize);
export const CompanyMemberInvitation = CompanyMemberInvitationSchema(sequelize);
User.hasMany(Company, {
    foreignKey: 'ownerId',
    onDelete: 'CASCADE',
    hooks: true,
});
Company.hasMany(Client, { foreignKey: 'companyId' });
Client.hasMany(Invoice, { foreignKey: 'clientId' });
Company.hasMany(Invoice, { foreignKey: 'companyId' });
Invoice.hasMany(InvoiceItems, { foreignKey: 'invoiceId' });
User.belongsToMany(Company, {
    through: CompanyMember,
    foreignKey: 'userId',
});
Company.belongsToMany(User, {
    through: CompanyMember,
    foreignKey: 'companyId',
});
User.hasMany(CompanyMember, {
    foreignKey: 'userId',
    as: 'members',
});
CompanyMember.belongsTo(User, {
    foreignKey: 'userId',
    targetKey: 'id',
});
CompanyMember.belongsTo(Company, {
    foreignKey: 'companyId',
});
User.hasOne(CompanyMemberInvitation, { foreignKey: 'userId' });
Company.hasMany(CompanyMemberInvitation, { foreignKey: 'companyId' });
const syncDbTables = async () => {
    await User.sync({ alter: true }).catch((err) => console.log('Could not create model User', err));
    await Company.sync({ alter: true }).catch((err) => console.log('Could not create model Company', err));
    await Client.sync({ alter: true }).catch((err) => console.log('Could not create model Client', err));
    await Invoice.sync({ alter: true }).catch((err) => console.log('Could not create model Invoice', err));
    await InvoiceItems.sync({ alter: true }).catch((err) => console.log('Could not create model InvoiceItems', err));
    await CompanyMember.sync({ alter: true }).catch((err) => console.log('Could not create model CompanyMember', err));
    await CompanyMemberInvitation.sync({ alter: false }).catch((err) => console.log('Could not create model CompanyMemberInvitation', err));
};
syncDbTables().catch((err) => {
    console.log(err);
});
export const testDbConnection = async () => {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
    }
    catch (error) {
        console.error('Unable to connect to the database:', error);
    }
};
export default sequelize;

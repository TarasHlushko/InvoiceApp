import { DataTypes, Model } from 'sequelize';
import { CompanyMember, CompanyMemberInvitation, Invoice, } from '../config/dbConfig.js';
class Company extends Model {
}
export default (sequelize) => {
    const CompanySchema = Company.init({
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            allowNull: false,
            defaultValue: DataTypes.UUIDV4,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true,
                len: [4, 20],
            },
        },
        ownerId: {
            type: DataTypes.UUID,
            allowNull: false,
        },
        country: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        zipCode: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        region: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        city: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        street: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        buildingNumber: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    }, {
        sequelize,
        paranoid: true,
        modelName: 'Company',
        tableName: 'companies',
        underscored: true,
    });
    CompanySchema.beforeDestroy(async (company) => {
        await Invoice.destroy({
            where: {
                companyId: company.id,
            },
        });
        await CompanyMember.destroy({
            where: {
                companyId: company.id,
            },
        });
        await CompanyMemberInvitation.destroy({
            where: {
                companyId: company.id,
            },
        });
    });
    return CompanySchema;
};

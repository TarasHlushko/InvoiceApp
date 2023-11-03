import { Model, DataTypes } from 'sequelize';
class CompanyMembers extends Model {
}
export default (sequelize) => {
    return CompanyMembers.init({
        userId: {
            type: DataTypes.UUID,
            allowNull: false,
            primaryKey: true,
        },
        role: {
            type: DataTypes.ENUM('Owner', 'Member'),
            allowNull: false,
        },
    }, {
        sequelize,
        modelName: 'CompanyMembers',
        tableName: 'company_members',
        paranoid: true,
        underscored: true,
    });
};

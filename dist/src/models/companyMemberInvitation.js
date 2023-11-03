import { DataTypes, Model, UUID } from 'sequelize';
class CompanyMemberInvitation extends Model {
}
export default (sequelize) => {
    return CompanyMemberInvitation.init({
        id: {
            type: UUID,
            primaryKey: true,
            allowNull: false,
            defaultValue: DataTypes.UUIDV4,
        },
    }, {
        sequelize,
        modelName: 'CompanyMemberInvitation',
        paranoid: true,
        underscored: true,
    });
};

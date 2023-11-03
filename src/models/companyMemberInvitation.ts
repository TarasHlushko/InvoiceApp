import { DataTypes, Model, Sequelize, UUID } from 'sequelize';

class CompanyMemberInvitation extends Model {
  public id!: string;
  public userId!: string;
  public companyId!: string;
}

export default (sequelize: Sequelize) => {
  return CompanyMemberInvitation.init(
    {
      id: {
        type: UUID,
        primaryKey: true,
        allowNull: false,
        defaultValue: DataTypes.UUIDV4,
      },
    },
    {
      sequelize,
      modelName: 'CompanyMemberInvitation',
      paranoid: true,
      underscored: true,
    }
  );
};

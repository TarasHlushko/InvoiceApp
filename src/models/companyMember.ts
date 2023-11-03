import { Model, Sequelize, DataTypes } from 'sequelize';

class CompanyMembers extends Model {
  public userId!: string;
  public companyId!: string;
  public role!: 'Owner' | 'Member';
  public createdAt!: Date;
  public updatedAt!: Date;
  public deletedAt!: Date | null;
}

export default (sequelize: Sequelize) => {
  return CompanyMembers.init(
    {
      userId: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
      },
      role: {
        type: DataTypes.ENUM('Owner', 'Member'),
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'CompanyMembers',
      tableName: 'company_members',
      paranoid: true,
      underscored: true,
    }
  );
};

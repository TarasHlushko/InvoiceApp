import { DataTypes, Model, Sequelize } from 'sequelize';
import bcrypt from 'bcrypt';
import { Company, CompanyMember } from '../config/dbConfig.js';

class User extends Model {
  public id!: string;
  public username!: string;
  public email!: string;
  public password!: number;
  comparePasswords = async (candidatePassword, userPassword) => {
    return await bcrypt.compare(candidatePassword, userPassword);
  };
  createdAt: Date;
}

export default (sequelize: Sequelize) => {
  const userSchema = User.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
        defaultValue: DataTypes.UUIDV4,
      },
      username: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
          len: [4, 20],
        },
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true,
          notEmpty: true,
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
          len: [8, 64],
        },
      },
      createdAt: {
        type: DataTypes.DATE,
      },
    },
    {
      sequelize,
      modelName: 'User',
      tableName: 'users',
      paranoid: true,
      underscored: true,
      indexes: [

      ],
    }
  );

  User.beforeSave(async (user, options) => {
    if (user.changed('password')) {
      user.password = await bcrypt.hash(user.password, 10);
    }
  });

  User.beforeDestroy((user) => {
    Company.destroy({
      where: {
        ownerId: user.id,
      },
    });
    CompanyMember.destroy({
      where: {
        userId: user.id,
      },
    });
  });

  return userSchema;
};

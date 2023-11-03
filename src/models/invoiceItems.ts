import { Sequelize, DataTypes, Model } from 'sequelize';

class InvoiceItem extends Model {
  public id!: string;
  public invoiceId!: string;
  public description!: string;
  public rate!: number;
  public hours!: number;
  public total!: number;
}

export default (sequelize: Sequelize) => {
  return InvoiceItem.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      invoiceId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      description: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      rate: {
        type: DataTypes.DECIMAL(),
        allowNull: false,
      },
      hours: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      total: {
        type: DataTypes.VIRTUAL,
        get() {
          return parseFloat((this.rate * this.hours).toFixed(2));
        },
      },
    },
    {
      sequelize,
      modelName: 'invoiceItems', // Set the model name
      paranoid: true,
      underscored: true,
    }
  );
};

import { DataTypes, Model } from 'sequelize';
class InvoiceItem extends Model {
}
export default (sequelize) => {
    return InvoiceItem.init({
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
    }, {
        sequelize,
        modelName: 'invoiceItems',
        paranoid: true,
        underscored: true,
    });
};

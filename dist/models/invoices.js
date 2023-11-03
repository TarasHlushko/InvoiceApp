import { DataTypes, Model } from 'sequelize';
import { InvoiceItems } from '../config/dbConfig.js';
class Invoice extends Model {
}
export default (sequelize) => {
    const InvoiceSchema = Invoice.init({
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            allowNull: false,
            defaultValue: DataTypes.UUIDV4,
        },
        status: {
            type: DataTypes.ENUM('Created', 'Sent', 'Paid', 'Overdue'),
            allowNull: false,
            defaultValue: 'Created',
        },
        dueDate: {
            type: DataTypes.DATE,
            allowNull: false,
            validate: {
                isDate: true,
                isAfterRightNow(value) {
                    const currentDate = new Date();
                    if (value <= currentDate) {
                        throw new Error('Due date must be after current date');
                    }
                },
            },
        },
    }, {
        sequelize,
        paranoid: true,
        modelName: 'Invoice',
        tableName: 'invoices',
        underscored: true,
    });
    InvoiceSchema.beforeDestroy((invoice) => {
        InvoiceItems.destroy({
            where: {
                invoiceId: invoice.id,
            },
        });
    });
    return InvoiceSchema;
};

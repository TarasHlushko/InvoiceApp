import { DataTypes, Model } from 'sequelize';
class Client extends Model {
}
export default (sequelize) => {
    return Client.init({
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
                isAlphanumeric: true,
                len: [4, 20],
            },
        },
        email: {
            type: DataTypes.STRING,
            allowNull: true,
            validate: {
                isEmail: true,
                notEmpty: true,
            },
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
        modelName: 'Client',
        tableName: 'clients',
        underscored: true,
    });
};

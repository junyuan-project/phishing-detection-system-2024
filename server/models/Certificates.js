module.exports = (sequelize, DataTypes) => {
    const Certificates = sequelize.define("Certificates", {
        certificate_id: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        certificate_name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        certificate_issuer: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        certificate_validFrom: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        certificate_validTo: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    });
    return Certificates;
};
module.exports = (sequelize, DataTypes) => {
    const PhishURL = sequelize.define("PhishURL", {
        user_id: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        url: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        url_id: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        status: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    });

    return PhishURL;
};

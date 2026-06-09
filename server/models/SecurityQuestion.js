module.exports = (sequelize, DataTypes) => {
    const SecurityQuestion = sequelize.define("SecurityQuestion", {
        user_id: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        q1: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        q1a: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        q2: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        q2a: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        q3: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        q3a: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    });
    return SecurityQuestion;
};

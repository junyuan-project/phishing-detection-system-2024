module.exports = (sequelize, DataTypes) => {
    const ReportedURL = sequelize.define("ReportedURL", {
        url: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        url_id: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        url_safe: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        url_status: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        url_score: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        url_ip: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        url_domain: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        url_country: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        url_server: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        url_asn: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        url_asnname: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        url_submitter: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        url_certificate_id: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        url_request_length: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        url_domain_length: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        url_subdomain_length: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        url_ip_length: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        url_ipv6_length: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        url_cookies_length: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    });
    return ReportedURL;
};
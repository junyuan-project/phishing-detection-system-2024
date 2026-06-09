const express = require('express');
const axios = require('axios');
const router = express.Router();
const { ReportedURL, Certificates } = require("../models");

router.post('/storeURL', async (req, res) => {
    try {
        const {
            url,
            url_id,
            url_safe,
            url_status,
            url_score,
            url_ip,
            url_domain,
            url_country,
            url_server,
            url_asn,
            url_asnname,
            url_submitter,
            url_certificate_id,
            url_request_length,
            url_domain_length,
            url_subdomain_length,
            url_ip_length,
            url_ipv6_length,
            url_cookies_length
        } = req.body;

        const reportedURL = await ReportedURL.create({
            url: url,
            url_id: url_id,
            url_safe: url_safe,
            url_status: url_status,
            url_score: url_score,
            url_ip: url_ip,
            url_domain: url_domain,
            url_country: url_country,
            url_server: url_server,
            url_asn: url_asn,
            url_asnname: url_asnname,
            url_submitter: url_submitter,
            url_certificate_id: url_certificate_id,
            url_request_length: url_request_length,
            url_domain_length: url_domain_length,
            url_subdomain_length: url_subdomain_length,
            url_ip_length: url_ip_length,
            url_ipv6_length: url_ipv6_length,
            url_cookies_length: url_cookies_length
        });

        res.status(201).json({ message: 'Reported URL stored successfully', reportedURL });
    } catch (error) {
        console.error('Error storing reported URL:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.post('/storeCertificate', async (req, res) => {
    try {
        const {
            certificate_id,
            certificate_name,
            certificate_issuer,
            certificate_validFrom,
            certificate_validTo
        } = req.body;

        const certificate = await Certificates.create({
            certificate_id: certificate_id,
            certificate_name: certificate_name,
            certificate_issuer: certificate_issuer,
            certificate_validFrom: certificate_validFrom,
            certificate_validTo: certificate_validTo,
        });

        res.status(201).json({ message: 'Certificate stored successfully', certificate });
    } catch (error) {
        console.error('Error storing certificate:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.get('/getReportedURLById/:url_id', async (req, res) => {
    try {
        const { url_id } = req.params;
        const reportedURL = await ReportedURL.findOne({
            where: { url_id: url_id }
        });

        if (!reportedURL) {
            return res.status(201).json({ data: 'Reported URL not found' });
        }

        res.status(200).json({ data: reportedURL });
    } catch (error) {
        console.error('Error fetching reported URL:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// router.get('/getCertificateById/:certificate_id', async (req, res) => {
//     try {
//         const { certificate_id } = req.params;
//         const certificate = await Certificates.findOne({
//             where: { certificate_id: certificate_id }
//         });

//         if (!certificate) {
//             return res.status(404).json({ error: 'Certificate not found' });
//         }

//         res.status(200).json({ data: certificate });
//     } catch (error) {
//         console.error('Error fetching certificate:', error);
//         res.status(500).json({ error: 'Internal Server Error' });
//     }
// });

router.get('/getCertificatesById/:certificate_id', async (req, res) => {
    try {
        const { certificate_id } = req.params;
        const certificates = await Certificates.findAll({
            where: { certificate_id: certificate_id }
        });

        if (certificates.length === 0) {
            return res.status(404).json({ error: 'Certificates not found' });
        }

        res.status(200).json({ data: certificates });
    } catch (error) {
        console.error('Error fetching certificates:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;
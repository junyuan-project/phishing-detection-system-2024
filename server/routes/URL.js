const express = require('express');
const axios = require('axios');
const router = express.Router();
const { PhishURL } = require('../models');

const apiUrl = 'https://urlscan.io/api/v1/scan/';
const apiKey = 'b9f494c9-6d05-4912-aa11-71c13b2677c6';

router.post('/scan', async (req, res) => {
    const { urlToScan } = req.body;

    if (!urlToScan) {
        return res.status(400).json({ error: 'Missing URL in the request body' });
    }

    const headers = {
        'API-Key': apiKey,
    };

    try {
        const response = await axios.post(apiUrl, { url: urlToScan }, { headers });
        const { uuid } = response.data;

        setTimeout(async () => {
            const resultApiUrl = `https://urlscan.io/api/v1/result/${uuid}/`;

            const resultResponse = await axios.get(resultApiUrl, { headers });
            res.status(200).json({ uuid, result: resultResponse.data });
        }, 10000);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: error.response.data.description});
    }
});

router.post('/upload', async (req, res) => {
    const { urlToUpload, user_id } = req.body;

    if (!urlToUpload) {
        return res.status(400).json({ error: 'Missing URL in the request body' });
    }

    try {
        // Create a new record in the PhishURL table
        await PhishURL.create({
            user_id: user_id,
            url: urlToUpload,
            url_id: '-',
            status: 'Pending',
        });

        res.status(200).json({ message: 'URL uploaded successfully' });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.get('/get-all-data', async (req, res) => {
    try {
        const { status } = req.query;
        const condition = status ? { where: { status: status } } : {};

        const allData = await PhishURL.findAll(condition);

        // Return the data in the response
        res.status(200).json({ data: allData });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.put('/edit/:id', async (req, res) => {
    const { id } = req.params;
    const { url_id, status } = req.body;

    try {
        const phishURL = await PhishURL.findByPk(id);

        if (!phishURL) {
            return res.status(404).json({ error: 'URL not found' });
        }

        // Update the URL_ID and Status
        await phishURL.update({ url_id, status });

        res.status(200).json({ message: 'URL updated successfully' });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.delete('/delete/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const phishURL = await PhishURL.findByPk(id);

        if (!phishURL) {
            return res.status(404).json({ error: 'URL not found' });
        }

        // Delete the URL
        await phishURL.destroy();

        res.status(200).json({ message: 'URL deleted successfully' });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;

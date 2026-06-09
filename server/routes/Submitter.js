const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');

router.get('/:uuid', async (req, res) => {
    try {
        const { uuid } = req.params;
        const url = `https://urlscan.io/api/v1/result/${uuid}/`;
        const response = await fetch(url);
        const data = await response.json();

        if (data) {
            res.json(data);
        } else {
            console.error('API response does not contain submitter data:', data);
            res.status(404).json({ error: 'Submitter data not found' });
        }
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;

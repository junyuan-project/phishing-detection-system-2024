const axios = require('axios');

const apiUrl = 'https://urlscan.io/api/v1/scan/';
const apiKey = 'b9f494c9-6d05-4912-aa11-71c13b2677c6';
const urlToScan = 'https://urlscan.io/';

const headers = {
    'API-Key': apiKey,
};

// Step 1: Perform the scan
axios.post(apiUrl, { url: urlToScan }, { headers })
    .then(response => {
        const { uuid } = response.data;
        console.log('Submission successful. UUID:', uuid);

        // Step 2: Introduce a delay before fetching the result
        setTimeout(() => {
            // Step 3: Retrieve the result using the UUID
            const resultApiUrl = `https://urlscan.io/api/v1/result/${uuid}/`;

            axios.get(resultApiUrl, { headers })
                .then(resultResponse => {
                    console.log('Scan result:', resultResponse.data);
                })
                .catch(resultError => {
                    console.error('Error fetching scan result:', resultError);
                });
        }, 10000); // Increased delay to 10 seconds
    })
    .catch(error => {
        console.error('Error submitting scan:', error);
    });

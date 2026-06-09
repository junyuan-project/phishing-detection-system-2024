const express = require('express');
const router = express.Router();
const emailValidator = require('deep-email-validator');

router.post('/verify-email', async (req, res) => {
    const email = req.body.email;

    console.log('Verifying email:', email);
    const validationResults = await emailValidator.validate(email);

    res.json(validationResults);
});

module.exports = router;
const { verify } = require('jsonwebtoken');

const validateToken = (req, res, next) => {
    const authorizationHeader = req.header('Authorization');
    if (!authorizationHeader) {
        return res.json({ error: 'User not logged in!' });
    }
    const accessToken = authorizationHeader.split(' ')[1];

    try {
        const validToken = verify(accessToken, "importantsecret");
        req.user = validToken;
        if (validToken) {
            return next();
        }
    } catch (err) {
        return res.json({ error: err });
    }
};

module.exports = { validateToken };

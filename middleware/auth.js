const jwt = require('jsonwebtoken');
const config = require('config');

function auth(req, res, next) {
    const token = req.header('x-auth-token');
    if (!token) {
        return res.status(401).json({'error': 'Unauthorized'});
    }

    try {
        req.user = jwt.verify(token, config.get("jwtPrivateKey"));
        next();
    } catch (error) {
        res.status(400).json({'error': 'Invalid Token'});
    }
}

module.exports = auth;
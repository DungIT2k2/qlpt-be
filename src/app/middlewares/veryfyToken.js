const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    const token = req.cookies['Auth-Token'];

    if (!token) return res.status(401).send('Access Denied');

    try {
        const verified = jwt.verify(token, 'jwt-test');
        req.user = verified;
        next();
    } catch (err) {
        return response.status(400).send('Invalid Token');
    }
};

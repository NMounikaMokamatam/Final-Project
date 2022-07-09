const jwt = require('jsonwebtoken');
const auth = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if(token == null) return res.sendStatus(401);
    jwt.verify(token, process.env.JWT_ACCESS_SECRET, (err, decoded) => {
        if(err) return res.sendStatus(403);
        next();
    })
}
module.exports = auth;

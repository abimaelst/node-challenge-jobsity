const bcrypt = require('bcryptjs');
const User = require('../models/User');

module.exports = async function (req, res, next) {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) throw new Error('Authorization header missing');

        const [type, credentials] = authHeader.split(' ');
        if (type !== 'Basic') throw new Error('Unsupported authentication type');

        const decoded = Buffer.from(credentials, 'base64').toString('ascii');
        const [email, password] = decoded.split(':');

        const user = await User.findOne({ email });
        if (!user) throw new Error('Invalid email or password');

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) throw new Error('Invalid email or password');

        req.user = user;
        next();
    } catch (error) {
        res.status(401).json({ error: error.message });
    }
};
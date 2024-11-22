module.exports = async function(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).send('No authentication header');

    const [type, credentials] = authHeader.split(' ');
    if (type !== 'Basic') return res.status(400).send('Only Basic Auth is supported');

    const decoded = Buffer.from(credentials, 'base64').toString('ascii');
    const [email, password] = decoded.split(':');

    const User = require('../models/User');
    const user = await User.findOne({ email });
    if (!user) return res.status(401).send('User not found');

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(401).send('Invalid password');

    req.user = user;
    next();
};
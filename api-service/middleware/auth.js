module.exports = function(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ message: 'No auth header' });

    const [type, credentials] = authHeader.split(' ');
    if (type !== 'Basic') return res.status(400).json({ message: 'Unsupported auth type' });

    next();
}
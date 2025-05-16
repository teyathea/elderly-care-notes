import jwt from 'jsonwebtoken';

export const verifyAdmin = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ message: 'No token, authorization denied' })

    const token = authHeader.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'No token, authorization denied' })

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if(decoded.role !== 'admin') return res.status(403).json({ message: 'Access forbidden' })

        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Token is not valid' })
    }
}
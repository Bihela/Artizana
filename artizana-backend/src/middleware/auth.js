const jwt = require('jsonwebtoken');
const { initCasbin } = require('../config/casbin');

module.exports = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) return res.status(401).json({ error: 'No token provided' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;  // Includes id and role

    // Enforce RBAC (e.g., check if role can access route)
    const enforcer = await initCasbin();
    const canAccess = await enforcer.enforce(decoded.role, req.path, 'read');
    if (!canAccess) return res.status(403).json({ error: 'Access denied for your role' });

    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
};
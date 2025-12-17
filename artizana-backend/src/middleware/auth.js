const jwt = require('jsonwebtoken');
const { initCasbin } = require('../config/casbin.js');

module.exports = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      console.warn(`[AUTH FAILURE] No token provided. IP: ${req.ip}, Path: ${req.originalUrl || req.path}`);
      return res.status(401).json({ error: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;  // includes id and role

    // Casbin RBAC check
    const enforcer = await initCasbin();
    const canAccess = await enforcer.enforce(decoded.role, req.path, 'read');
    if (!canAccess) {
      console.warn(`[AUTH FAILURE] Access denied (RBAC). User: ${decoded.email} (${decoded.role}), Path: ${req.originalUrl || req.path}, IP: ${req.ip}`);
      return res.status(403).json({ error: 'Access denied for your role' });
    }

    next();
  } catch (err) {
    console.warn(`[AUTH FAILURE] Invalid token. IP: ${req.ip}, Path: ${req.originalUrl || req.path}, Error: ${err.message}`);
    res.status(401).json({ error: 'Invalid token' });
  }
};
const jwt = require('jsonwebtoken');
const User = require('../models/User');

module.exports = function (roles = []) {
  if (typeof roles === 'string') {
    roles = [roles];
  }

  return async (req, res, next) => {
    const token = req.header('Authorization')?.split(' ')[1];
    
    if (!token) return res.status(401).json({ message: 'No token, authorization denied' });

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Check if user is suspended in database
      const user = await User.findById(decoded.id);
      if (!user) return res.status(401).json({ message: 'User not found' });
      if (user.isSuspended) {
        return res.status(403).json({ 
          message: 'Account suspended', 
          reason: user.suspensionReason || 'Contact support for details' 
        });
      }
      
      req.user = decoded;

      // If specific roles are required, check authorization access
      if (roles.length && !roles.includes(req.user.role)) {
        return res.status(403).json({ message: 'Forbidden: Access denied' });
      }

      next();
    } catch (err) {
      res.status(401).json({ message: 'Token is not valid' });
    }
  };
};
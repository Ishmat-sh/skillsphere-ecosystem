const jwt = require('jsonwebtoken');

module.exports = function (roles = []) {
  if (typeof roles === 'string') {
    roles = [roles];
  }

  return (req, res, next) => {
    const token = req.header('Authorization')?.split(' ')[1];
    
    if (!token) return res.status(401).json({ message: 'No token, authorization denied' });

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
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
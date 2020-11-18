const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

module.exports = (req, res, next) => {
  const token = req.header('authorization');

  if (!token) {
    return res.status(401).json({ msg: 'no token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token.slice(7), process.env.JWT_SECRET);
    req.user = decoded.user;
    next();
  } catch (error) {
    return res.status(401).json({ msg: 'invalid token' });
  }
};

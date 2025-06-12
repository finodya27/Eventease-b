exports.verifySession = (req, res, next) => {
  if (req.session && req.session.userId) {
    next();
  } else {
    res.status(401).json({ message: 'Access denied. Please log in.' });
  }
};

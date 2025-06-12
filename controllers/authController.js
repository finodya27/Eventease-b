const bcrypt = require('bcryptjs');
const User = require('../models/user');

// Login pengguna
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    req.session.userId = user._id;
    res.json({ message: 'Login successful' });
  } catch (error) {
    res.status(500).json({ message: 'Error logging in', error });
  }
};

exports.checkSession = (req, res) => {
  if (req.session && req.session.userId) {
    res.status(200).json({ message: 'Session is active' });
  } else {
    res.status(401).json({ message: 'Session expired or not logged in' });
  }
};

// Logout pengguna
exports.logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) return res.status(500).json({ message: 'Error logging out' });
    res.json({ message: 'Logout successful' });
  });
};

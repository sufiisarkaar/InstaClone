const bcrypt = require('bcrypt');
const userModel = require('../users');
const passport = require('passport');

const login_Controller = async (req, res) => {
  const userName = req.body.username;
  const inputPassword = req.body.password;

  try {
    // Retrieve user from the database
    const user = await userModel.findOne({ username: userName });

    if (user) {
      // Extract salt and hash from the database
      const storedSalt = user.salt; // Replace 'salt' with the actual field name in your schema
      const storedHash = user.hash; // Replace 'hash' with the actual field name in your schema

      // Combine salt from the database with input password
      const combinedValue = storedSalt + inputPassword;

      // Hash the combined value using bcrypt
      const hashedPassword = await bcrypt.hash(combinedValue, 10);

      // Compare the resulting hash with the stored hash from the database
      if (hashedPassword === storedHash) {
        res.json({ success: 'user found' });
      } else {
        res.json({ failed: 'invalid password' });
      }
    } else {
      res.json({ failed: 'user not found' });
    }
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = { login_Controller };

'use strict';

const auth = require('basic-auth');
const bcryptjs = require('bcryptjs');
const { User } = require('../models');

// Middleware to authenticate request using basic-auth
exports.authenticateUser = async (req, res, next) => {
  let message; // store message to display
  const credentials = auth(req);

  // if the user's credentials are available... check if user exists by email
  if (credentials) { 
    const user = await User.findOne({ where: { emailAddress: credentials.emailAddress } });
      if (user) { // if user is found in db
        const authenticated = bcryptjs.compareSync(credentials.pass, user.password);
          if (authenticated) { // if passwords match
            console.log(`Authentication successful for username: ${user.emailAddress}`);

            // store the user on the Request object
            req.currentUser = user;
          } else {
            // not authenticated 
            message = `Authentication failure for ${user.emailAddress}`;
          }
      } else {
        // user not found
        message = `User not found for email: ${user.emailAddress}`;
      }
  } else {
    // auth header not found
    message = 'Authorization header not found';
  }

  if (message) {
    console.warn(message);
    res.status(401).json({ message: 'Access denied' });
  } else {
    next();
  }
}

'use strict';

const express = require('express');

// Middleware functions
const { asyncHandler } = require('../middleware/async-handler');
const { authenticateUser } = require('../middleware/auth-user');
const { check, validationResult } = require('express-validator');

// Database Model
const { User } = require('../models');

// RegExp -- may need to find a regex library
// no numerics, allows hyphen
const nameRegex = /^[a-zA-Z-]+(?:[\s-][a-zA-Z-]+)*$/;

// construct router instance
const router = express.Router();

/* GET the user */
router.get('/users', authenticateUser, asyncHandler(async (req, res) => {
  const user = req.currentUser;
  res.status(200).json({ user });
}));

/* CREATE a new user */
router.post('/users', [
  check('firstName')
    .isLength({ min: 2 })
    .matches(nameRegex)
    .withMessage('First name is required. Please use only alphabetic characters and hyphens.'),
  check('lastName')
    .isLength({ min: 2 })
    .matches(nameRegex)
    .withMessage('Last name is required. Please use only alphabetic characters and hyphens.'),
  check('emailAddress')
    .isEmail()
    .withMessage('Invalid email format'),
  check('password')
    .isLength({ min: 8, max: 20 })
    .withMessage('Must be 8-20 characters in length.')
],
  asyncHandler(async (req, res) => {
    // errors will be sent to result if checks are invalid
    const result = validationResult(req);

    // if result contains no errors ...
    if (result.isEmpty()) {
      let user;
      try {
        await User.create(req.body);
        res.status(201).location('/').end();
      } catch (error) {
        if (error.name === "SequelizeValidationError" || error.name === "SequelizeUniqueConstraintError") {
          user = await User.build(req.body);
          const errors = error.errors.map(err => err.message);
          res.status(400).json({ errors });   
        } else {
          throw error; //error caught in the asyncHandler's catch block
        }
      }
    } else {
      res.status(400).json({ errors: result.array() }); // runs if invalid values in user input fields
    }
  })
);

module.exports = router;

'use strict';

const express = require('express');
const { check, validationResult } = require('express-validator');

const { asyncHandler } = require('../middleware/async-handler');
const { authenticateUser } = require('../middleware/auth-user');

const { User } = require('../models');

// RegExp -- may need to find a regex library
// no numerics, allows hyphen
const nameRegex = /^[a-zA-Z-]+(?:[\s-][a-zA-Z-]+)*$/;

// construct router instance
const router = express.Router();

// GET route that returns all properties and values of the user
router.get('/users', authenticateUser, asyncHandler(async (req, res) => {
  const user = req.currentUser;
  res.status(200).send({ user });
}));

// POST route that will create a new user,
router.post('/users', [
  // express validations
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
      try {
        await User.create(req.body);
        res.status(201).location('/').end();
      } catch (error) {
        if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
          const errors = error.errors.map(err => err.message);
          res.status(400).send({ errors });
        }
      }
    } else {
      res.status(400).send({ errors: result.array() });
    }
  })
);

module.exports = router;

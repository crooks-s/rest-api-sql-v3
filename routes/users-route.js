'use strict';

const express = require('express');
const { asyncHandler } = require('../middleware/async-handler');
const { check, validationResult } = require('express-validator');
const bcryptjs = require('bcryptjs');
const { authenticateUser } = require('../middleware/auth-user');

// RegExp -- may need to find a regex library
// no numerics, allows hyphen
const nameRegex = /^[a-zA-Z-]+(?:[\s-][a-zA-Z-]+)*$/;

// construct router instance
const router = express.Router();

// GET route that returns all properties and values of the user
router.get('/users', authenticateUser, asyncHandler(async (req, res) => {
  const user = req.currentUser;
  res.status(200).json({ user });
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
    // errors will be sent to result if checks are invalid/falsy
    const result = validationResult(req);
    let { password } = req.body;

    // if result contains no errors ...
    if (result.isEmpty()) {
      const hashedPassword = bcryptjs.hashSync(req.body.password, 10);
      password = hashedPassword;
      res.status(201).location('/').end();
    } else {
      res.status(400).send({ errors: result.array() });
    }
  })
);

module.exports = router;

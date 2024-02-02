'use strict';

const express = require('express');
const { asyncHandler } = require('../middleware/async-handler');
const { check, validationResult } = require('express-validator');
const bcryptjs = require('bcryptjs');

// RegExp -- may need to find a regex library
// no numerics, allows hyphen
const nameRegex = /^[a-zA-Z-]+(?:[\s-][a-zA-Z-]+)*$/;

// construct router instance
const router = express.Router();

// GET route that returns all properties and values
// for the currently authenticated User
// and 200 code
router.get('/users', asyncHandler(async (req, res) => {
  res.json({ message: "/users got GET! nice" });
}));

// POST route that will create a new user,
// set Location header to "/",
// and return a 201 code with no content
router.post('/users', [
  // express validations
  check('firstName')
    .isLength({ min: 2 })
    .matches(nameRegex)
    .withMessage('First name is required. Please use only alphabetic characters.'),
  check('lastName')
    .isLength({ min: 2 })
    .matches(nameRegex)
    .withMessage('Last name is required. Please use only alphabetic characters.'),
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

    if (result.isEmpty()) {
      const hashedPassword = bcryptjs.hashSync(req.body.password, 10);
      password = hashedPassword;
      res.status(201).json();
    } else {
      res.status(400).send({ errors: result.array() });
    }
  })
);

module.exports = router;
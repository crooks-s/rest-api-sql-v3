'use strict';

const express = require('express');
const { check, validationResult } = require('express-validator');

const { asyncHandler } = require('../middleware/async-handler');
const { authenticateUser } = require('../middleware/auth-user');

const { Course, User } = require('../models');

// construct router instance
const router = express.Router();

// GET route that will return all courses and associated users
router.get('/courses', asyncHandler(async (req, res) => {
  const courses = await Course.findAll({
    include: {
      model: User,
    },
  });
  if (courses.length > 0) {
    res.status(200).send(courses);
  } else {
    res.status(404).send({ message: 'No courses were found.' });
  }
}));

// GET route that will return the corresponding course
// including the User associated with that course
// and 200 code
router.get('/courses/:id', asyncHandler(async (req, res) => {
  const courseId = req.params.id;
  const course = await Course.findByPk(courseId);

  res.status(200).send();
}));

// POST route that will create a new course,
// set the Location header to the UTI for the newly created course,
// return 201, no content
router.post('/courses', authenticateUser, [
  check('title')
    .notEmpty()
    .withMessage('Please enter a valid course title.'),
  check('description')
    .notEmpty()
    .withMessage('Please enter a valid course description.'),
],
  asyncHandler(async (req, res) => {
    // errors will be sent to result if checks are invalid/falsy
    const result = validationResult(req);

    if (result.isEmpty()) {
      res.status(201).json({ message: 'no content' })
    } else {
      res.status(400).send({ errors: result.array() });
    }
  })
);

// PUT route that will update the corresponding course,
// return 204, no content
router.put('/courses/:id', authenticateUser, [
  check('title')
    .notEmpty()
    .withMessage('Please enter a valid course title.'),
  check('description')
    .notEmpty()
    .withMessage('Please enter a valid course description.'),
],
  asyncHandler(async (req, res) => {
    // errors will be sent to result if checks are invalid/falsy
    const result = validationResult(req);

    if (result.isEmpty()) {
      res.status(204).json({ message: 'no content' })
    } else {
      res.status(400).send({ errors: result.array() });
    }
  })
);

// DELETE route that will delete the corresponding course,
// return 204, no content
router.delete('/courses/:id', authenticateUser, asyncHandler(async (req, res) => {
  res.status(204).json({ message: '/courses DELETE --- no content ---' });
}));

module.exports = router;

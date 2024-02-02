'use strict';

const express = require('express');
const { asyncHandler } = require('../middleware/async-handler');
const { check, validationResult } = require('express-validator');

// construct router instance
const router = express.Router();

// GET route that will return all courses
// including the User associated with each course
// and 200 code
router.get('/courses', asyncHandler(async (req, res) => {
  res.status(200).json({ message: '/courses got GET! nice' });
}));

// GET route that will return the corresponding course
// including the User associated with that course
// and 200 code
router.get('/courses/:id', asyncHandler(async (req, res) => {
  res.status(200).json({ message: '/courses/id got GET! nice' });
}));

// POST route that will create a new course,
// set the Location header to the UTI for the newly created course,
// return 201, no content
router.post('/courses', [
  check('title').notEmpty(),
  check('description').notEmpty()
],
  asyncHandler(async (req, res) => {
    res.status(201).json({ message: '/courses POST --- no content ---' });
  }));

// PUT route that will update the corresponding course,
// return 204, no content
router.put('/courses/:id', asyncHandler(async (req, res) => {
  res.status(204).json({ message: '/courses/id PUT --- no content ---' });
}));

// DELETE route that will delete the corresponding course,
// return 204, no content
router.delete('/courses/:id', asyncHandler(async (req, res) => {
  res.status(204).json({ message: '/courses DELETE --- no content ---' });
}));

module.exports = router;
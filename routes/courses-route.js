'use strict';

const express = require('express');

// Middleware functions
const { asyncHandler } = require('../middleware/async-handler');
const { authenticateUser } = require('../middleware/auth-user');
const { check, validationResult } = require('express-validator');

// Database Models 
const { Course, User } = require('../models');

// Construct router instance
const router = express.Router();

/* GET all courses and their owners(users) */
router.get('/courses', asyncHandler(async (req, res) => {
  const courses = await Course.findAll({
    include: {
      model: User,
    },
  });
  if (courses.length > 0) {
    res.status(200).json(courses);
  } else {
    res.status(404).json({ message: 'No courses were found.' });
  }
}));

/* GET a course and its owner(user) */
router.get('/courses/:id', asyncHandler(async (req, res) => {
  const courseId = req.params.id;
  const course = await Course.findByPk(courseId, {
    include: {
      model: User,
    }
  });
  if (course) {
    res.status(200).send(course);
  } else {
    res.status(404).send({ message: 'Course not found.' });
  }
}));

/* CREATE a new course */
router.post('/courses', authenticateUser, [
  check('title')
    .notEmpty()
    .withMessage('Please enter a valid course title.'),
  check('description')
    .notEmpty()
    .withMessage('Please enter a valid course description.'),
],
  asyncHandler(async (req, res) => {
    // errors are sent to result if checks are invalid
    const result = validationResult(req);

    // if no errors in result ...
    if (result.isEmpty()) {
      try {
        const course = await Course.build(req.body);
        const user = await User.findByPk(req.body.userId);

        // check if user exists before Course can be saved
        if (!user) {
          res.status(404).json({ message: 'User not found' });
        }

        await course.save();
        res.status(201).location(`/courses/${course.id}`).end();
      }  catch (error) {
        if (error.name === "SequelizeValidationError" || error.name === "SequelizeUniqueConstraintError") {
          const errors = error.errors.map(err => err.message);
          res.status(400).json({ errors });   
        } else {
          throw error; //error caught in the asyncHandler's catch block
        }
      }
    } else {
      res.status(400).send({ errors: result.array() }); // runs if empty title or description
    }
  })
);

/* UPDATE a course */
router.put('/courses/:id', authenticateUser, [
  check('title')
    .notEmpty()
    .withMessage('Please enter a valid course title.'),
  check('description')
    .notEmpty()
    .withMessage('Please enter a valid course description.'),
],
  asyncHandler(async (req, res) => {
    // errors will be sent to result if checks are invalid
    const result = validationResult(req);

    // if no errors in result ...
    if (result.isEmpty()) {
      let course;
      try {
        course = await Course.findByPk(req.params.id);
        if (course) {
          // update course instance with req.body
          await course.set(req.body);

          const user = await User.findByPk(req.body.userId);

          // check if user exists before Course can be saved
          if (!user) {
            res.status(404).json({ message: 'User not found' });
          }

          await course.save();
          res.status(204).location(`/courses/${course.id}`).end();
        } else {
          res.status(404).json({ message: 'Course not found.' });
        }
      } catch (error) {
        if (error.name === "SequelizeValidationError" || error.name === "SequelizeUniqueConstraintError") {
          const errors = error.errors.map(err => err.message);
          res.status(400).json({ errors });
        } else {
          throw error; //error caught in the asyncHandler's catch block
        }
      }
    } else {
      res.status(400).send({ errors: result.array() }); // runs if empty title or description
    }
  })
);

/* DELETE a course */
router.delete('/courses/:id', authenticateUser, asyncHandler(async (req, res) => {
  const course = await Course.findByPk(req.params.id);
  if (course) {
    await course.destroy();
    res.status(204).end();
  } else {
    res.status(404).json({ message: 'Course not found' });
  }
}));

module.exports = router;

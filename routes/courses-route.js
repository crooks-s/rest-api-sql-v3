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
    res.status(200).json(courses);
  } else {
    res.status(404).json({ message: 'No courses were found.' });
  }
}));

// GET route that will return the requested course and associated users
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

// POST route that will create a new course,
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
      } catch (error) {
        if (error.name === "SequelizeValidationError") {
          article = await Article.build(req.body);
          res.render("articles/edit", { article, errors: error.errors, title: "Edit Article" })
        } else {
          throw error; //error caught in the asyncHandler's catch block
        }
      }
    } else {
      res.status(400).send({ errors: result.array() });
    }
  })
);

// PUT route that will update the corresponding course,
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
          res.status(204).end();
        } else {
          res.status(404).json({ message: 'Course not found.' });
        }
      } catch (error) {
        if (error.name === "SequelizeValidationError") {
          article = await Article.build(req.body);
          res.render("articles/edit", { article, errors: error.errors, title: "Edit Article" })
        } else {
          throw error; //error caught in the asyncHandler's catch block
        }
      }
    } else {
      res.status(400).send({ errors: result.array() });
    }
  })
);

// DELETE route that will delete the corresponding course,
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

'use strict';

const express = require('express');
const { asyncHandler } = require('./middleware/async-handler');

// construct router instance
const router = express.Router();

// GET route that returns all properties and values
// for the currently authenticated User along with 200 code
router.get('/users', asyncHandler( async(req, res) => {
  res.json({ message: "got GET! nice" });
}));

// POST route that will create a new user,
// set Location header to "/",
// and return a 201 code with no content
router.post('/users', asyncHandler( async(req,res) => {
  res.status(201).json({ message: "created something! nice" })
}));

module.exports = router;
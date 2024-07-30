const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const bookController = require('../controllers/bookController');

router.get('/books', bookController.getBooks);
router.get('/books/:id', bookController.getBook);
router.post(
    '/books',
    [
        check('name', 'Name is required').not().isEmpty(),
    ],
    bookController.createBook
);

module.exports = router;

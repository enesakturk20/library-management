const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const userController = require('../controllers/userController');

router.get('/users', userController.getUsers);
router.get('/users/:id', userController.getUser);
router.post(
    '/users',
    [
        check('name', 'Name is required').not().isEmpty(),
    ],
    userController.createUser);
router.post('/users/:id/borrow/:bookId', userController.borrowBook);
router.post(
    '/users/:id/return/:bookId',
    [
        check('score').isFloat({ min: 1, max: 5 }).withMessage('Score must be an integer between 1 and 5')
    ],
    userController.returnBook
);
router.get('/users/:id/present-books', userController.getUserPresentBooks);
router.get('/users/:id/past-books', userController.getUserPastBooks);

module.exports = router;

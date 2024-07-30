const { validationResult } = require("express-validator");

const User = require('../models/userModel');
const Book = require('../models/bookModel');

const getUsers = async (req, res) => {
    try {
        const users = await User.find({});
        res.status(200).json(users);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

const getUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

const createUser = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log(errors);
        return res.status(422).json({ error: 'Invalid inputs passed, please checkyour data.' });
    }

    try {
        const user = new User(req.body);
        await user.save();
        res.status(201).json(user);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

const borrowBook = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        const book = await Book.findById(req.params.bookId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        if (book.isBorrowed) {
            return res.status(400).json({ message: 'This book is already borrowed by another user.' });
        }
        user.books.present.push(req.params.bookId);
        book.isBorrowed = true;
        await user.save();
        await book.save();
        res.status(200).json({ message: "The book has been borrowed successfully" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const returnBook = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log(errors);
        return res.status(422).json({ error: "The score must be a number between 1 and 5" });
    }

    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const bookIndex = user.books.present.indexOf(req.params.bookId);
        if (bookIndex === -1) {
            return res.status(404).json({ message: 'Book not borrowed' });
        }

        user.books.present.splice(bookIndex, 1);
        user.books.past.push({ bookId: req.params.bookId, userScore: req.body.score });
        await user.save();

        const book = await Book.findById(req.params.bookId);
        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }

        // Mevcut kullanıcının daha önce puan verip vermediğini kontrol et
        const existingRatingIndex = book.ratings.findIndex(r => r.userId.equals(user._id));

        if (existingRatingIndex !== -1) {
            // Eğer daha önce puan vermişse, eski puanı güncelle
            book.ratings[existingRatingIndex].score = req.body.score;
        } else {
            // Eğer daha önce puan vermemişse, yeni puan ekle
            book.ratings.push({ userId: user._id, score: req.body.score });
        }

        // Yeni kitap skorunu hesapla
        const totalScore = book.ratings.reduce((acc, r) => acc + r.score, 0);
        book.score = totalScore / book.ratings.length;

        book.isBorrowed = false;

        await book.save();

        res.status(200).json({ message: "The book was returned successfully" });

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const getUserPresentBooks = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).populate('books.present');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        if (user.books.present.length < 1) {
            return res.status(200).json({ message: "User has no present books" });
        }
        res.status(200).json(user.books.present);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const getUserPastBooks = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).populate('books.past.bookId');
        if (user.books.past.length < 1) {
            return res.status(200).json({ message: "User has no past books" });
        }
        res.status(200).json(user.books.past);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

module.exports = { getUsers, getUser, createUser, borrowBook, returnBook, getUserPresentBooks, getUserPastBooks }

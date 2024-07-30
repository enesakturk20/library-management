const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    books: {
        past: [
            {
                bookId: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'Book'
                },
                userScore: {
                    type: Number,
                    required: false
                }
            }
        ],
        present: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Book'
            }
        ]
    }
});

const User = mongoose.model('User', userSchema);

module.exports = User;

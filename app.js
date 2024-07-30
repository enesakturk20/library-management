const express = require('express');
const bodyParser = require('body-parser');
const connectDB = require('./config/db');

const userRoutes = require('./routes/userRoutes');
const bookRoutes = require('./routes/bookRoutes');

const app = express();

// Connect Database
connectDB();

// Init Middleware
app.use(bodyParser.json());

// Routes
app.use('/api', userRoutes);
app.use('/api', bookRoutes);

app.get('/', (req, res) => res.send('API Running...'));

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

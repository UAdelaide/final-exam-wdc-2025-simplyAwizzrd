const express = require('express');
const path = require('path');
const session = require('express-session');
const mysql = require('mysql2/promise');
require('dotenv').config();

const app = express();

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, '/public')));

// Connect to the database
let db;

mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'DogWalking'
})

// Routes
// Login route
app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    const [rows] = await d

})

const walkRoutes = require('./routes/walkRoutes');
const userRoutes = require('./routes/userRoutes');

app.use('/api/walks', walkRoutes);
app.use('/api/users', userRoutes);

// Export the app instead of listening here
module.exports = app;
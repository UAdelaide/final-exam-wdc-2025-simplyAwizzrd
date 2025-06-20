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
    database: 'DogWalkService'
}).then(connection => {
    db = connection;
}).catch(err => {
    console.error('DB connection failed:', err);
})


// Routes
// Login route
app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    // CHeck if user with given username and password actually exists
    const [rows] = await db.execute('SELECT * FROM Users WHERE username = ? AND password_hash = ?', [username, password]);
    

    i

})

const walkRoutes = require('./routes/walkRoutes');
const userRoutes = require('./routes/userRoutes');

app.use('/api/walks', walkRoutes);
app.use('/api/users', userRoutes);

// Export the app instead of listening here
module.exports = app;
const express = require('express');
const path = require('path');
const session = require('express-session'); // Session middleware to store user info
const mysql = require('mysql2/promise'); // To connect to MySQL database
require('dotenv').config();

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Almost forgot the middleware for form POST
app.use(express.static(path.join(__dirname, '/public')));

// Session config - sign session ID cookie, and save new sessions
app.use(session({
    secret: 'secret',
    resave: false,         // Don't save session if unmodified
    saveUninitialized: true,
}))

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

    // If there isn't a user with the given credentials, return
    if (rows.length === 0) return res.redirect('/');

    const user = rows[0];

    // Save the user info into the session
    req.session.user = {
        id: user.user_id,
        username: user.username,
        role: user.role
    };

    // Then redirect based on the user's role
    if (user.role === 'owner') {
        res.redirect('/owner-dashboard.html');
    } else if (user.role === 'walker') {
        res.redirect('/walker-dashboard.html');
    } else {
        res.redirect('/');
    }
});

// Logout route
app.get('/logout', (req, res) => {
    // Destroy the session and redirect to the home page
    req.session.destroy(err => {
        if (err) {
            console.error('Logout error: ', err);
        }
        res.clearCookie('connect.sid'); // Clear the session's cookie
        
    })
})

const walkRoutes = require('./routes/walkRoutes');
const userRoutes = require('./routes/userRoutes');

app.use('/api/walks', walkRoutes);
app.use('/api/users', userRoutes);

// Export the app instead of listening here
module.exports = app;
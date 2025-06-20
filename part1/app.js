const express = require('express');
const mysql = require('mysql2/promise');
const app = express();

let db;

async function databaseConnection() {
    db = await mysql.createConnection({
        host: 'localhost',
        root: 'root',
        password: '',
        database: 'DogWalkService'
    });
}

async function testData() {
    await db.execute(`
        INSERT IGNORE INTO Users (username, email, password_hash, role) VALUES
        ('alice123', 'alice@example.com', 'hashed123', 'owner'),
        ('bobwalker', 'bob@example.com', 'hashed456', 'walker'),
        ('carol123', 'carol@example.com', 'hashed789', 'owner');
    `);

    await db.execute(`
        INSERT IGNORE INTO Dogs (owner_id, name, size) VALUES
        ((SELECT user_id FROM Users WHERE username = 'alice123'), 'Max', 'medium'),
        ((SELECT user_id FROM Users WHERE username = 'carol123'), 'Bella', 'small');
    `);

    await db.execute(`
        INSERT IGNORE INTO WalkRequests (dog_id, requested_time, duration_minutes, location, status) VALUES
        ((SELECT dog_id FROM Dogs WHERE name = 'Max'), '2025-06-10 08:00:00', 30, 'Parklands', 'open'),
        ((SELECT dog_id FROM Dogs WHERE name = 'Bella'), '2025-06-10 09:30:00', 45, 'Beachside Ave', 'accepted');
    `);

    await db.execute(`
        INSERT IGNORE INTO WalkRatings (request_id, walker_id, owner_id, rating) VALUES
        ((SELECT request_id FROM WalkRequests WHERE request_id = 2),
        (SELECT user_id FROM Users WHERE username = 'bobwalker'),
        (SELECT user_id FROM Users WHERE username = 'carol123'), 5);
    `);
}

app.get('/api/dogs', async (req, res) => {
    try {
        const [rows] = await db.execute(`
            SELECT d.name AS dog_name, d.size, u.username`)
    }
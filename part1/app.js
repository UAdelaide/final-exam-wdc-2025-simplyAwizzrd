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
        INSERT IGNORE INTO Walks (walker_id, dog_id, date, time, duration) VALUES
        ((SELECT user_id FROM Users WHERE username = 'bobwalker'),
         (SELECT dog_id FROM Dogs WHERE name = 'Max'), '2023-10-01', '10:00:00', 60),
        ((SELECT user_id FROM Users WHERE username = 'bobwalker'),
         (SELECT dog_id FROM Dogs WHERE name = 'Bella'), '2023-10-02', '11:00:00', 45);
    `);
}
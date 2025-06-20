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
        INSERT IGNORE INTO Users
}
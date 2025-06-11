import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

// Adjust the path as necessary to point to the correct location of your database file
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.resolve(__dirname, 'CR_Database.db');
const db = new sqlite3.Database(dbPath, sqlite3.OPEN_READWRITE, (err) => {
    if (err) {
        console.error('Error opening the database:', err.message);
    } else {
        console.log('Connected to the SQLite database.');
    }
});

export default db;

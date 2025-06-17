const sqlite3 = require('sqlite3');
const { open } = require('sqlite');
const path = require('path');
const fs = require('fs');

async function initializeDatabase() {
    // Ensure the database file is created in the server root directory
    const dbPath = path.join(__dirname, '..', '..', 'sentiments.db');
    
    console.log('Creating database at:', dbPath);

    try {
        // Create database connection
        const db = await open({
            filename: dbPath,
            driver: sqlite3.Database
        });

        console.log('Creating tables...');

        // Create tables
        await db.exec(`
            CREATE TABLE IF NOT EXISTS users (
                handle_id TEXT PRIMARY KEY,
                company_name TEXT NOT NULL,
                ip_address TEXT NOT NULL,
                registered_at DATETIME DEFAULT CURRENT_TIMESTAMP
            );

            CREATE TABLE IF NOT EXISTS sentiments (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                handle_id TEXT,
                sentiment TEXT CHECK(sentiment IN ('GREAT', 'MEH', 'UGH')),
                timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (handle_id) REFERENCES users(handle_id)
            );
        `);

        console.log('Database initialized successfully!');
        await db.close();

    } catch (error) {
        console.error('Error initializing database:', error);
        process.exit(1);
    }
}

initializeDatabase(); 
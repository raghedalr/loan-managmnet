const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./database.sqlite', (err) => {
    if (err) {
        console.error('Error opening database:', err.message);
    } else {
        console.log('Connected to SQLite database.');

        // Initialize tables after connection is established
        db.serialize(() => {
            // Users table
            db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        role TEXT NOT NULL DEFAULT 'branch_manager'
      )`, (err) => {
                if (err) {
                    console.error('Error creating users table:', err);
                } else {
                    console.log('Users table ready');
                }
            });

            // Loan applications table
            db.run(`CREATE TABLE IF NOT EXISTS loan_applications (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        application_number INTEGER UNIQUE NOT NULL,
        applicant_name TEXT NOT NULL,
        loan_amount REAL NOT NULL,
        status TEXT NOT NULL DEFAULT 'Pending',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`, (err) => {
                if (err) {
                    console.error('Error creating loan_applications table:', err);
                } else {
                    console.log('Loan applications table ready');
                    // Seed data after tables are created
                    require('./seed');
                }
            });
        });
    }
});

module.exports = db;
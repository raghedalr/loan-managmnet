const db = require('./database');
const bcrypt = require('bcryptjs');

// Check if our test user exists
db.get('SELECT * FROM users WHERE username = ?', ['manager'], (err, row) => {
    if (err) {
        console.error('Error querying database:', err);
        return;
    }

    if (row) {
        console.log('User found:', row);

        // Test the password
        bcrypt.compare('password123', row.password, (err, result) => {
            if (err) {
                console.error('Error comparing passwords:', err);
                return;
            }

            console.log('Password match:', result);
        });
    } else {
        console.log('User not found in database');

        // Create the user manually
        bcrypt.hash('password123', 10, (err, hash) => {
            if (err) {
                console.error('Error hashing password:', err);
                return;
            }

            db.run(
                'INSERT INTO users (username, password, role) VALUES (?, ?, ?)',
                ['manager', hash, 'branch_manager'],
                function (err) {
                    if (err) {
                        console.error('Error creating user:', err);
                    } else {
                        console.log('Test user created successfully');
                    }
                }
            );
        });
    }
});
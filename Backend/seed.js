const db = require('./database');
const bcrypt = require('bcryptjs');

// Create test user
const createTestUser = () => {
    const username = 'manager';
    const password = 'password123';
    const role = 'branch_manager';

    bcrypt.hash(password, 10, (err, hash) => {
        if (err) {
            console.error('Error hashing password:', err);
            return;
        }

        db.run(
            'INSERT OR IGNORE INTO users (username, password, role) VALUES (?, ?, ?)',
            [username, hash, role],
            function (err) {
                if (err) {
                    console.error('Error creating test user:', err);
                } else {
                    console.log('Test user created: manager / password123');
                }
            }
        );
    });
};

// Create some sample loan applications
const createSampleLoans = () => {
    const loans = [
        { application_number: 1001, applicant_name: 'Abdulaziz M', loan_amount: 5000.00, status: 'Pending' },
        { application_number: 1002, applicant_name: 'Sarah S', loan_amount: 7500.50, status: 'Approved' },
        { application_number: 1003, applicant_name: 'Raghad A', loan_amount: 12000.00, status: 'Rejected' },
        { application_number: 1004, applicant_name: 'Mariam O', loan_amount: 3000.75, status: 'Pending' }
    ];

    loans.forEach(loan => {
        db.run(
            'INSERT OR IGNORE INTO loan_applications (application_number, applicant_name, loan_amount, status) VALUES (?, ?, ?, ?)',
            [loan.application_number, loan.applicant_name, loan.loan_amount, loan.status],
            function (err) {
                if (err) {
                    console.error('Error creating sample loan:', err);
                }
            }
        );
    });

    console.log('Sample loan applications created');
};

// Initialize database with seed data
db.serialize(() => {
    createTestUser();
    createSampleLoans();
});

console.log('Database seeding completed');
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('./database');
const auth = require('./auth');

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = 'your-jwt-secret-key-change-in-production';

app.use(cors());
app.use(express.json());

// Login endpoint
app.post('/auth/login', (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: 'Username and password required' });
    }

    db.get(
        'SELECT * FROM users WHERE username = ?',
        [username],
        async (err, user) => {
            if (err) {
                return res.status(500).json({ error: 'Database error' });
            }

            if (!user) {
                return res.status(401).json({ error: 'Invalid credentials' });
            }

            try {
                const validPassword = await bcrypt.compare(password, user.password);

                if (!validPassword) {
                    return res.status(401).json({ error: 'Invalid credentials' });
                }

                const token = jwt.sign(
                    { id: user.id, username: user.username, role: user.role },
                    JWT_SECRET,
                    { expiresIn: '24h' }
                );

                res.json({
                    token,
                    user: {
                        id: user.id,
                        username: user.username,
                        role: user.role
                    }
                });
            } catch (error) {
                res.status(500).json({ error: 'Server error' });
            }
        }
    );
});

// Get all loans with optional status filter
app.get('/loans', auth, (req, res) => {
    const { status } = req.query;
    let query = 'SELECT * FROM loan_applications';
    let params = [];

    if (status && ['Pending', 'Approved', 'Rejected'].includes(status)) {
        query += ' WHERE status = ?';
        params.push(status);
    }

    query += ' ORDER BY created_at DESC';

    db.all(query, params, (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(rows);
    });
});

const fetchLoans = async () => {
    try {
        console.log('Fetching loans with token:', token);
        console.log('Authorization header:', axios.defaults.headers.common['Authorization']);

        const params = filterStatus ? { status: filterStatus } : {};
        const response = await axios.get(`${API_BASE_URL}/loans`, { params });
        setLoans(response.data);
        console.log('Loans fetched successfully:', response.data);
    } catch (err) {
        console.error('Error fetching loans:', err);
        setError('Failed to fetch loans: ' + (err.response?.data?.error || err.message));
    }
};

// Get single loan by ID
app.get('/loans/:id', auth, (req, res) => {
    const { id } = req.params;

    db.get(
        'SELECT * FROM loan_applications WHERE id = ?',
        [id],
        (err, row) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }

            if (!row) {
                return res.status(404).json({ error: 'Loan application not found' });
            }

            res.json(row);
        }
    );
});

// Create new loan application
app.post('/loans', auth, (req, res) => {
    const { application_number, applicant_name, loan_amount } = req.body;

    if (!application_number || !applicant_name || !loan_amount) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    if (isNaN(loan_amount) || loan_amount <= 0) {
        return res.status(400).json({ error: 'Loan amount must be a positive number' });
    }

    db.run(
        `INSERT INTO loan_applications (application_number, applicant_name, loan_amount) 
     VALUES (?, ?, ?)`,
        [application_number, applicant_name, parseFloat(loan_amount)],
        function (err) {
            if (err) {
                if (err.message.includes('UNIQUE constraint failed')) {
                    return res.status(400).json({ error: 'Application number must be unique' });
                }
                return res.status(500).json({ error: err.message });
            }

            res.status(201).json({
                message: 'Loan application created successfully',
                id: this.lastID
            });
        }
    );
});

// Update loan status
app.put('/loans/:id/status', auth, (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    if (!['Pending', 'Approved', 'Rejected'].includes(status)) {
        return res.status(400).json({ error: 'Invalid status value' });
    }

    db.run(
        `UPDATE loan_applications 
     SET status = ?, updated_at = CURRENT_TIMESTAMP 
     WHERE id = ?`,
        [status, id],
        function (err) {
            if (err) {
                return res.status(500).json({ error: err.message });
            }

            if (this.changes === 0) {
                return res.status(404).json({ error: 'Loan application not found' });
            }

            res.json({ message: 'Status updated successfully' });
        }
    );
});

// Health check endpoint
// Add this with your other routes
app.get('/', (req, res) => {
    res.json({
        message: 'Loan Management API is running!',
        endpoints: {
            login: 'POST /auth/login',
            getLoans: 'GET /loans',
            getLoan: 'GET /loans/:id',
            createLoan: 'POST /loans',
            updateStatus: 'PUT /loans/:id/status'
        }
    });
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
});
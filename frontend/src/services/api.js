const API_BASE_URL = 'http://localhost:5000';

// Login function
export const login = async (username, password) => {
    try {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });

        if (!response.ok) {
            throw new Error('Login failed');
        }

        const data = await response.json();
        localStorage.setItem('token', data.token); // Store token
        localStorage.setItem('user', JSON.stringify(data.user)); // Store user info
        return data;
    } catch (error) {
        console.error('Login error:', error);
        throw error;
    }
};

// Get loans function
export const getLoans = async (status = '') => {
    try {
        const token = localStorage.getItem('token');
        let url = `${API_BASE_URL}/loans`;

        if (status) {
            url += `?status=${status}`;
        }

        const response = await fetch(url, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch loans');
        }

        return await response.json();
    } catch (error) {
        console.error('Get loans error:', error);
        throw error;
    }
};

// Add more API functions as needed:
export const createLoan = async (loanData) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/loans`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(loanData)
    });
    return await response.json();
};

export const updateLoanStatus = async (id, status) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/loans/${id}/status`, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status })
    });
    return await response.json();
};

// Logout function (optional)
export const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
};


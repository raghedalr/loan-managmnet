import React, { useState, useEffect } from 'react';
import { login, getLoans, logout, createLoan, updateLoanStatus } from './services/api';
import { useAuth } from './hooks/useAuth';
import './App.css';

function App() {
    const [loans, setLoans] = useState([]);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [filterStatus, setFilterStatus] = useState('');
    const [showAddForm, setShowAddForm] = useState(false);
    const [newLoan, setNewLoan] = useState({
        application_number: '',
        applicant_name: '',
        loan_amount: ''
    });
    const { user, loading } = useAuth();

    useEffect(() => {
        if (user) {
            loadLoans();
        }
    }, [user, filterStatus]);

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            await login(username, password);
            window.location.reload();
        } catch (error) {
            alert('Login failed: ' + error.message);
        }
    };

    const loadLoans = async () => {
        try {
            const loansData = await getLoans(filterStatus);
            setLoans(loansData);
        } catch (error) {
            alert('Failed to load loans: ' + error.message);
        }
    };

    const handleLogout = () => {
        logout();
        window.location.reload();
    };

    const handleAddLoan = async (e) => {
        e.preventDefault();
        try {
            await createLoan({
                application_number: parseInt(newLoan.application_number),
                applicant_name: newLoan.applicant_name,
                loan_amount: parseFloat(newLoan.loan_amount)
            });
            setNewLoan({ application_number: '', applicant_name: '', loan_amount: '' });
            setShowAddForm(false);
            loadLoans(); // Refresh the list
            alert('Loan application added successfully!');
        } catch (error) {
            alert('Error adding loan: ' + error.message);
        }
    };

    const handleStatusUpdate = async (id, newStatus) => {
        try {
            await updateLoanStatus(id, newStatus);
            loadLoans(); // Refresh the list
            alert('Status updated successfully!');
        } catch (error) {
            alert('Error updating status: ' + error.message);
        }
    };

    if (loading) {
        return <div className="loading">Loading...</div>;
    }

    if (!user) {
        return (
            <div className="login-container">
                <h2>Loan Management System</h2>
                <form onSubmit={handleLogin} className="login-form">
                    <div className="form-group">
                        <input
                            type="text"
                            placeholder="Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="login-btn">Login</button>
                </form>
            </div>
        );
    }

    return (
        <div className="App">
            <header className="app-header">
                <h2>Loan Management System</h2>
                <div className="user-info">
                    <span>Welcome, {user.username}</span>
                    <button onClick={handleLogout} className="logout-btn">Logout</button>
                </div>
            </header>

            <div className="loans-container">
                <div className="loans-header">
                    <h3>Loan Applications</h3>
                    <div className="actions">
                        <button
                            onClick={() => setShowAddForm(!showAddForm)}
                            className="add-btn"
                        >
                            {showAddForm ? 'Cancel' : 'Add New Application'}
                        </button>
                        <div className="filter-section">
                            <label>Filter by status: </label>
                            <select
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                                className="status-filter"
                            >
                                <option value="">All</option>
                                <option value="Pending">Pending</option>
                                <option value="Approved">Approved</option>
                                <option value="Rejected">Rejected</option>
                            </select>
                        </div>
                    </div>
                </div>

                {showAddForm && (
                    <div className="add-form">
                        <h4>Add New Loan Application</h4>
                        <form onSubmit={handleAddLoan}>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Application Number:</label>
                                    <input
                                        type="number"
                                        value={newLoan.application_number}
                                        onChange={(e) => setNewLoan({ ...newLoan, application_number: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Applicant Name:</label>
                                    <input
                                        type="text"
                                        value={newLoan.applicant_name}
                                        onChange={(e) => setNewLoan({ ...newLoan, applicant_name: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Loan Amount:</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={newLoan.loan_amount}
                                        onChange={(e) => setNewLoan({ ...newLoan, loan_amount: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>
                            <button type="submit" className="submit-btn">Add Application</button>
                        </form>
                    </div>
                )}

                <div className="loans-list">
                    {loans.length === 0 ? (
                        <p className="no-loans">No loan applications found.</p>
                    ) : (
                        <table className="loans-table">
                            <thead>
                                <tr>
                                    <th>Application #</th>
                                    <th>Applicant Name</th>
                                    <th>Loan Amount</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loans.map(loan => (
                                    <tr key={loan.id}>
                                        <td>{loan.application_number}</td>
                                        <td>{loan.applicant_name}</td>
                                        <td>${loan.loan_amount}</td>
                                        <td>
                                            <span className={`status status-${loan.status.toLowerCase()}`}>
                                                {loan.status}
                                            </span>
                                        </td>
                                        <td>
                                            {loan.status === 'Pending' && (
                                                <div className="action-buttons">
                                                    <button
                                                        onClick={() => handleStatusUpdate(loan.id, 'Approved')}
                                                        className="approve-btn"
                                                    >
                                                        Approve
                                                    </button>
                                                    <button
                                                        onClick={() => handleStatusUpdate(loan.id, 'Rejected')}
                                                        className="reject-btn"
                                                    >
                                                        Reject
                                                    </button>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
}

export default App;
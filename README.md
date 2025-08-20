# Loan Manager App

A simple web app to manage loans and payments. Built with React frontend and Node.js backend.

## What's Inside

- **Frontend**: React app for the user interface
- **Backend**: Node.js API server  
- **Database**: SQLite (no setup needed - it's built-in!)

## Getting Started

### First, get the backend running:

```bash
cd Backend
npm install

# Create a .env file with:
# PORT=5000
# JWT_SECRET=something-secret-here
# (No database setup needed - SQLite works automatically!)

npm start
Then, get the frontend running:
bash
cd frontend
npm install
npm start
The app should open at http://localhost:3000

What the API Can Do
For Users:
POST /api/auth/login - Sign in

GET /api/auth/me - Check who's logged in and their Role

Sample User:

Username: manager

Password: password123

For Loans:
GET /api/loans - See all loans

POST /api/loans - Add new loan

PUT /api/loans/:id - Update loan Status

For Payments:
GET /api/loans/:id/payments - See payments for a loan

POST /api/loans/:id/payments - Record payment

File Setup
text
/Backend
  /models       -> Database models (SQLite)
  /routes       -> API routes
  /middleware   -> Auth stuff
  server.js     -> Main server file
  database.js   -> SQLite database setup
  database.sqlite -> Your actual database file (auto-created)

/frontend
  /src
    /components -> React components
    /pages      -> Different screens
    /services   -> API calls
  public/       -> Static files
Settings Needed
Backend (.env file):

text
PORT=5000
JWT_SECRET=make-this-a-random-string
# No database config needed - SQLite just works!
Frontend (.env file):

text
REACT_APP_API_URL=http://localhost:5000
Database Info
This app uses SQLite 

When Something's Not Working
Backend won't start? Check if port 5000 is available
Frontend can't connect? Make sure backend is running on port 5000

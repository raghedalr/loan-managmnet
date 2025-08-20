# Loan Manager App

A simple web app to manage loans and payments. Built with React frontend and Node.js backend.

## What's Inside

- **Frontend**: React app for the user interface
- **Backend**: Node.js API server
- **Database**: MongoDB for storing data

## Getting Started

### First, get the backend running:

```bash
cd Backend
npm install

# Create a .env file with:
# PORT=5000
# MONGODB_URI=mongodb://localhost:27017/loandb
# JWT_SECRET=something-secret-here

npm start
Then, get the frontend running:
bash
cd frontend
npm install
npm start
The app should open at http://localhost:3000

What the API Can Do
For Users:
POST /api/auth/register - Create account

POST /api/auth/login - Sign in

GET /api/auth/me - Check who's logged in

For Loans:
GET /api/loans - See all loans

POST /api/loans - Add new loan

PUT /api/loans/:id - Update loan

DELETE /api/loans/:id - Remove loan

For Payments:
GET /api/loans/:id/payments - See payments for a loan

POST /api/loans/:id/payments - Record payment

File Setup
text
/Backend
  /models       -> Database models
  /routes       -> API routes
  /middleware   -> Auth stuff
  server.js     -> Main server file

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
MONGODB_URI=your-database-connection
JWT_SECRET=make-this-a-random-string
Frontend (.env file):

text
REACT_APP_API_URL=http://localhost:5000
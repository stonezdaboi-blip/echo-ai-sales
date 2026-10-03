```markdown
# ECHO Setup Guide

## Prerequisites
- Node.js v16+
- PostgreSQL 13+
- npm or yarn

## Installation

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
Install dependencies:
npm install
Create .env file:
cp .env.example .env
Update .env with your configuration:
DATABASE_URL=postgresql://user:password@localhost:5432/echo_db
OPENAI_API_KEY=your_key_here
NODE_ENV=development
PORT=3000
Run migrations:
npm run migrate
Start development server:
npm run dev
Server will run on http://localhost:3000
Mobile Setup
Navigate to mobile directory:
Install dependencies:
npm install
Start development server:
npm start
Scan QR code with Expo Go app on your phone
Database Setup
Create PostgreSQL database:
createdb echo_db
npm run migrate
Testing
Run tests:
npm test
Check coverage:
npm run test:coverage
Troubleshooting
Port 3000 already in use
kill -9 $(lsof -t -i:3000)
Database connection error
Check DATABASE_URL is correct
Ensure PostgreSQL is running
Verify database exists
Mobile app won't connect
Ensure backend is running
Check API_URL in mobile config
Verify phone and computer on same network

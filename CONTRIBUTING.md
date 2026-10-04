# Contributing to ECHO

Thank you for your interest in contributing to ECHO! This guide will help you get started.

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/YOUR_USERNAME/echo-ai-sales.git`
3. Create a branch: `git checkout -b feature/your-feature`
4. Install dependencies: `npm run install-all`

## Development Setup

### Backend
```bash
cd backend
npm install
npm run dev
Server runs on http://localhost:3000
Mobile
cd mobile
npm install
npm start
Scan QR code with Expo Go
Making Changes
Create a feature branch: git checkout -b feature/my-feature
Make your changes
Run tests: npm test
Commit with clear messages: git commit -m "feat: add my feature"
Push to your fork: git push origin feature/my-feature
Create a Pull Request
Code Style
Use TypeScript for all backend code
Follow ESLint rules (configured in .eslintrc)
Format with Prettier
Write tests for new features
Keep functions small and focused
Testing
All new features must include tests:
cd backend
npm test
Target 85%+ code coverage
Commit Messages
Follow conventional commits:
feat: add new feature
fix: fix a bug
docs: update documentation
test: add tests
refactor: refactor code
Pull Request Process
Update README if needed
Add tests for new features
Ensure all tests pass
Request review from maintainers
Address feedback
Squash commits if requested
Questions?
Open an issue or start a discussion!
Thank you for contributing! 🚀

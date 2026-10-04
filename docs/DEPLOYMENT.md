# ECHO Deployment Guide

## Prerequisites

- Node.js v16+
- PostgreSQL 13+
- AWS Account (for production)
- Docker (optional)

## Local Development

### Setup

```bash
npm run install-all
npm run dev
Backend: http://localhost:3000
Mobile: Scan QR code with Expo Go
Database
createdb echo_db
npm run migrate
Docker Deployment
Build
docker-compose build
Run
docker-compose up -d
Services
Backend: http://localhost:3000
PostgreSQL: localhost:5432
Redis: localhost:6379
Production Deployment
AWS Deployment
1. Prepare Application
cd backend
npm run build
Configure Environment
Create .env.production:
DATABASE_URL=postgresql://...
OPENAI_API_KEY=sk-...
NODE_ENV=production
Deploy to AWS
# Option A: Elastic Beanstalk
eb init
eb create echo-prod
eb deploy

# Option B: EC2
# SSH to instance
# git clone repository
# npm install
# npm start
Setup Database
psql -h your-db-host -U admin -d echo_db < backend/src/db/migrations/001_init_schema.sql
Setup SSL
# Use AWS Certificate Manager
# Configure in load balancer
Monitoring
Logs
# Docker
docker-compose logs -f backend

# AWS Elastic Beanstalk
eb logs
Metrics
Response times
Error rates
Database performance
Memory usage
Scaling
Horizontal Scaling
Use load balancer (AWS ALB)
Deploy multiple instances
Use connection pooling
Vertical Scaling
Increase instance size
Increase database resources
Optimize database queries
Troubleshooting
Database Connection Failed
psql -h your-host -U admin -d echo_db -c "SELECT 1"
High Memory Usage
Check for memory leaks
Increase instance size
Enable caching
Slow Queries
Check query logs
Add indexes
Profile database
Rollback
# Docker
docker-compose down
# Previous version pulls
docker-compose up -d

# AWS Elastic Beanstalk
eb appversion list
eb deploy --version=previous-version
Backup
Database
pg_dump echo_db > backup.sql
For issues, create a GitHub issue or contact the team.

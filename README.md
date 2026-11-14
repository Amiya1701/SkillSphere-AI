# SkillSphere AI

An AI-ready personalized engineering learning platform with interactive technology bubbles, roadmaps, resources, quizzes, progress tracking, and a learning assistant.

## Stack
- Frontend: React + Vite + React Router + Axios + Framer Motion + Recharts
- Backend: Node.js + Express
- Database: MySQL
- Auth: JWT + bcryptjs

## Features
- Register / login
- JWT protected dashboard
- Animated technology explorer
- Dynamic roadmap pages
- Topic/resource pages
- Free and paid resource links
- Quiz system
- Progress tracking
- Learning dashboard and analytics
- AI assistant endpoint (optional API key)

## Run locally

### 1. Database
Create a MySQL database and run:
`server/sql/schema.sql`
then:
`server/sql/seed.sql`

### 2. Backend
```bash
cd server
npm install
cp .env.example .env
# edit .env
npm run dev
```

### 3. Frontend
```bash
cd client
npm install
cp .env.example .env
npm run dev
```

Frontend: http://localhost:5173
Backend: http://localhost:5000

## Production
This repository is deployment-ready, but it is not already deployed because deployment requires your own hosting accounts, database credentials, domain, and API keys. Never commit `.env` files or API keys.

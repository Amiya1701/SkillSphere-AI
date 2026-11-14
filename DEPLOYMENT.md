# Deployment checklist

## Frontend
Build:
```bash
cd client
npm install
npm run build
```
Deploy the `client` app to a static frontend host. Set:
`VITE_API_URL=https://YOUR-BACKEND-DOMAIN/api`

## Backend
Set environment variables from `server/.env.example` in your Node hosting service.
Run:
```bash
npm install
npm start
```

## Database
Create a managed MySQL database with your chosen provider and run:
- `server/sql/schema.sql`
- `server/sql/seed.sql`

Update `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, and `DB_NAME`.

## AI
The AI assistant is optional. Add `OPENAI_API_KEY` and `OPENAI_MODEL` to the backend environment. The key must stay on the server and must never be placed in React/Vite environment variables.

## Before publishing
- Change `JWT_SECRET`
- Remove sample credentials
- Test CORS with the deployed frontend URL
- Do not commit `.env`
- Replace demo resource links with carefully reviewed official/current resources
- Add your own screenshots and project demo URL to the README

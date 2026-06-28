# MOHIT.EXE v2.0

A retro-inspired portfolio experience built with Next.js, TypeScript, Prisma, and a terminal-style UI.

## Features
- Retro operating-system inspired interface
- Character sheet and resume page
- Project showcase and AI lab
- Arcade mini-games and interactive experiences
- Admin dashboard for portfolio content and avatar management

## Tech Stack
- Next.js 16
- React 19
- TypeScript
- Tailwind CSS
- Prisma ORM
- PostgreSQL
- Vercel

## Installation
```bash
npm install
cp .env.example .env.local
```

## Environment Variables
See [.env.example](.env.example).

## Database Setup
```bash
npx prisma migrate dev
npx prisma db seed
```

## Running Locally
```bash
npm run dev
```

## Deployment
1. Create a GitHub repository.
2. Push the project.
3. Import it into Vercel.
4. Add environment variables.
5. Connect PostgreSQL and deploy.

## License
MIT

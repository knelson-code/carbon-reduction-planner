# CO₂ Reduction Planner

A full-stack web application for planning and tracking organizational carbon reduction initiatives.

## Features

- 🔐 **User Authentication** - Secure registration and login with NextAuth.js
- 🏢 **Organization Management** - Create and manage multiple organizations
- 📊 **Emission Tracking** - Track baseline emissions across Scopes 1, 2, and 3
- 🎯 **Reduction Targets** - Automatic calculation of 42% and 90% reduction targets
- 💾 **Database** - SQLite with Prisma ORM (production-ready for PostgreSQL)
- 🎨 **Modern UI** - Responsive design with Tailwind CSS

## Tech Stack

- **Framework:** Next.js 15 with App Router
- **Language:** TypeScript
- **Authentication:** NextAuth.js v4
- **Database:** Prisma ORM with SQLite (PostgreSQL ready)
- **Styling:** Tailwind CSS
- **Deployment:** Vercel

## Getting Started

### Prerequisites

- Node.js 20+ or 22+
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/knelson-code/carbon-reduction-planner.git
cd carbon-reduction-planner
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Edit `.env` and add your values.

4. Initialize the database:
```bash
npx prisma generate
npx prisma migrate dev
```

5. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Environment Variables

Required environment variables:

- `DATABASE_URL` - Database connection string
- `NEXTAUTH_SECRET` - Secret key for NextAuth.js
- `NEXTAUTH_URL` - URL of your application

## Deployment

This app is ready to deploy on Vercel:

1. Push your code to GitHub
2. Import your repository in Vercel
3. Add environment variables
4. Deploy!

For production, consider using PostgreSQL instead of SQLite.

## License

MIT

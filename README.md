# Tomcat Invoice Generator

A quick invoice generator app for creating downloadable PDF invoices. Built with Vite + React + TypeScript, Tailwind CSS + shadcn/ui, Auth0 (Google login), and PostgreSQL.

## Prerequisites

- Node.js 20+
- Docker & Docker Compose
- [Vercel CLI](https://vercel.com/docs/cli) (`npm i -g vercel`)
- An [Auth0](https://auth0.com) account (free tier)

## Auth0 Setup

1. Create an Auth0 tenant at [auth0.com](https://auth0.com)
2. Create a new **Single Page Application**
3. In the app settings, set:
   - **Allowed Callback URLs**: `http://localhost:3000, http://localhost:5173`
   - **Allowed Logout URLs**: `http://localhost:3000, http://localhost:5173`
   - **Allowed Web Origins**: `http://localhost:3000, http://localhost:5173`
4. Go to **Authentication > Social** and enable **Google** (uses Auth0 dev keys by default, fine for development)
5. Copy your **Domain** and **Client ID** into `.env.local` (see below)

## Local Development Setup

1. **Clone and install:**
   ```bash
   git clone git@github.com:tomiito/tomcat-invoice-generator.git
   cd tomcat-invoice-generator
   npm install
   ```

2. **Create your `.env.local`** from the example:
   ```bash
   cp .env.local.example .env.local
   ```
   Fill in your Auth0 credentials.

3. **Start the database:**
   ```bash
   docker compose up -d
   ```
   This starts PostgreSQL on port **5433** (to avoid conflicts with any local Postgres on 5432).

4. **Run the app:**
   ```bash
   vercel dev
   ```
   This starts both the Vite frontend and Vercel Functions (API) locally at `http://localhost:3000`.

   Alternatively, for frontend-only development:
   ```bash
   npm run dev
   ```
   This runs Vite at `http://localhost:5173` but API routes won't work.

5. **Verify the database connection:**
   ```
   GET http://localhost:3000/api/health
   ```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite dev server (frontend only) |
| `vercel dev` | Start full stack locally (frontend + API) |
| `npm run build` | Type-check and build for production |
| `npm run test` | Run tests |
| `npm run test:watch` | Run tests in watch mode |
| `npm run test:coverage` | Run tests with coverage report |
| `npm run lint` | Run ESLint |
| `npm run format` | Format code with Prettier |

## Project Structure

```
api/                  # Vercel Functions (serverless API)
  _lib/db.ts          # Shared Postgres pool client
  auth/sync.ts        # POST /api/auth/sync - upsert user profile
  health.ts           # GET /api/health - DB health check
db/
  init.sql            # Database schema (tables + indexes)
src/
  auth/               # Auth0 provider, protected route, profile sync hook
  components/         # Shared components (Navbar, shadcn/ui)
  pages/              # Route pages (Dashboard, Clients, Settings, etc.)
  utils/              # Utilities (formatCurrency, formatInvoiceNumber)
  test/               # Test setup and mocks
```

## Database

PostgreSQL runs via Docker Compose on port 5433. Tables are auto-created from `db/init.sql`:
- `profiles` - User profiles (synced from Auth0)
- `clients` - Client/customer records
- `invoices` - Invoice metadata (no PDF storage)
- `line_items` - Invoice line items
- `invoice_counters` - Auto-increment invoice numbers per user

To reset the database:
```bash
docker compose down -v
docker compose up -d
```

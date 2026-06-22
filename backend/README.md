# College Discovery Platform — Backend API

Production-grade NestJS backend for browsing, comparing, and reviewing Indian colleges. Built with a feature-based modular architecture, PostgreSQL (Neon-compatible), Prisma ORM, and JWT authentication.

## Architecture

```
src/
├── modules/          # Feature modules (auth, colleges, reviews, etc.)
├── prisma/           # Prisma service (global module)
├── config/           # Typed configuration
├── guards/           # JWT, roles, optional auth
├── interceptors/     # Logging + response transform
├── filters/          # Global exception handling
├── decorators/       # @CurrentUser, @Public, @Roles
└── utils/            # Helpers, structured logger
```

Each feature module follows **Controller → Service → Repository** separation:

- **Controllers** — HTTP routing only, no business logic
- **Services** — Business rules and orchestration
- **Repositories** — Prisma data access, query optimization

### Key design decisions

| Decision | Rationale |
|----------|-----------|
| Repository layer over direct Prisma in services | Keeps services testable and isolates query logic |
| Global JWT guard + `@Public()` decorator | Secure-by-default; explicit opt-out for public routes |
| `Role` enum on User model | RBAC-ready without over-engineering today |
| Standardized `{ success, data, pagination }` responses | Consistent API contract for frontend/Postman |
| Structured JSON logging with redaction | Production observability without leaking passwords |
| Composite DB indexes on filter columns | Fast search/filter on state, fees, rating |

## Tech stack

- **Runtime:** Node.js 20 + TypeScript
- **Framework:** NestJS 10
- **Database:** PostgreSQL (Neon or Docker)
- **ORM:** Prisma 6
- **Auth:** JWT + bcrypt
- **Validation:** class-validator + class-transformer
- **Docs:** Swagger at `/docs` and `/docs-json`
- **Security:** Helmet, CORS, rate limiting

## Quick start

### Prerequisites

- Node.js 20+
- PostgreSQL (local, Docker, or [Neon](https://neon.tech))

### 1. Install dependencies

```bash
cd backend
npm install
```

### 2. Configure environment

Copy `.env.example` to `.env` and set your values:

```env
DATABASE_URL="postgresql://user:pass@host/db?sslmode=require"
JWT_SECRET="your-long-random-secret"
JWT_EXPIRES_IN="7d"
PORT=3000
```

For Neon, run `npx neonctl@latest init` and use the connection string as `DATABASE_URL`.

### 3. Run migrations and seed

```bash
npx prisma migrate dev --name init
npm run prisma:seed
```

### 4. Start development server

```bash
npm run start:dev
```

- API: http://localhost:3000
- Swagger: http://localhost:3000/docs
- OpenAPI JSON: http://localhost:3000/docs-json

## Docker

```bash
docker compose up --build
```

Runs PostgreSQL + API. Migrations apply automatically on startup.

## API endpoints

### Auth

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/auth/register` | Public | Register new user |
| POST | `/auth/login` | Public | Login, returns JWT |
| GET | `/auth/profile` | JWT | Current user profile |

### Colleges

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/colleges` | Public | List with pagination, search, filters |
| GET | `/colleges/:id` | Public | Details + courses + placements + reviews |

**Query params:** `page`, `limit`, `search`, `location`, `state`, `minFees`, `maxFees`, `rating`, `sortBy`, `sortOrder`

### Compare

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/compare` | Optional JWT | Compare 2–5 colleges; save if authenticated + `name` |
| GET | `/comparisons` | JWT | Saved comparisons |

### Saved colleges

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/saved/:collegeId` | JWT | Save college |
| DELETE | `/saved/:collegeId` | JWT | Remove saved college |
| GET | `/saved` | JWT | List saved colleges |

### Reviews

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/reviews` | JWT | Create review (rating 1–5) |
| GET | `/reviews/:collegeId` | Public | Reviews for a college |

## Seed data

The seed script creates:

- **100 colleges** with realistic Indian names, states, and cities
- **Courses** (3–6 per college)
- **Placements** (1 per college)
- **Reviews** (2–8 per college)
- **20 test users** — email: `student1@collegeapp.in` … `student20@collegeapp.in`, password: `Password123!`

```bash
npm run prisma:seed
```

## Error format

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": ["email must be an email"]
}
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run start:dev` | Dev server with hot reload |
| `npm run build` | Production build |
| `npm run start:prod` | Run compiled app |
| `npm run prisma:migrate` | Create/apply migrations |
| `npm run prisma:seed` | Seed database |
| `npm run db:setup` | Deploy migrations + seed |

## Environment variables

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | Yes | PostgreSQL connection string |
| `JWT_SECRET` | Yes | JWT signing secret |
| `JWT_EXPIRES_IN` | No | Token expiry (default: `7d`) |
| `PORT` | No | Server port (default: `3000`) |
| `CORS_ORIGIN` | No | Allowed origins (default: `*`) |
| `THROTTLE_TTL` | No | Rate limit window ms (default: `60000`) |
| `THROTTLE_LIMIT` | No | Max requests per window (default: `100`) |

## License

MIT

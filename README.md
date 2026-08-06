# Chilahati Merchants High School Management System

A production-ready School Management System with a public website, admin panel, student portal, and teacher portal.

## Tech Stack

- **Frontend:** React 19, Vite, React Router, Tailwind CSS, Framer Motion
- **Backend:** Node.js, Express, MongoDB, Redis, JWT Authentication
- **Deployment:** Docker, Docker Compose, Nginx

## Quick Start

### Development

```bash
# Clone and install dependencies
git clone <repo-url>
cd chilahati-merchants-high-school

# Backend
cd backend
npm install
npm run dev

# Frontend (Public & Portals)
cd ../frontend
npm install
npm run dev

# Admin Panel (Standalone)
cd ../admin
npm install
npm run dev
```

### Production (Docker)

```bash
docker-compose up --build -d
```

Services:
- Frontend (Public/Student/Teacher): http://localhost
- Admin Panel: http://localhost:81 (or http://localhost:5174 in dev)
- Backend API: http://localhost/api
- MongoDB: mongodb://localhost:27017/school-management
- Redis: redis://localhost:6379

## Project Structure

```
chilahati-merchants-high-school/
├── backend/
│   ├── src/
│   │   ├── config/         # Database, Redis, Cloudinary config
│   │   ├── controllers/    # Request controllers (factory pattern)
│   │   ├── middleware/     # Auth, RBAC, error handling, validation
│   │   ├── models/         # Mongoose schemas
│   │   ├── routes/         # API routes
│   │   ├── services/       # Business logic (BaseService pattern)
│   │   ├── utils/          # JWT, ApiError, email, upload helpers
│   │   └── server.js       # Express server entry point
│   ├── .env.example
│   ├── Dockerfile
│   └── eslint.config.js
├── frontend/
│   ├── src/
│   │   ├── components/      # Reusable UI and layout components
│   │   ├── context/         # React context providers
│   │   ├── hooks/           # Custom React hooks
│   │   ├── pages/           # Public, student, teacher pages
│   │   ├── services/        # API service layer (axios)
│   │   ├── styles/          # Global CSS (Tailwind)
│   │   ├── App.jsx          # Main app with lazy-loaded routes
│   │   └── main.jsx         # React entry with providers
│   ├── public/             # Static assets
│   └── Dockerfile
├── admin/
│   ├── src/
│   │   ├── components/      # Admin UI, layout (AdminHeader, AdminSidebar)
│   │   ├── context/         # Auth, Language, Theme contexts
│   │   ├── pages/           # All Admin dashboard management pages
│   │   ├── services/        # API services
│   │   ├── styles/          # Admin styles
│   │   ├── App.jsx          # Dedicated Admin Router
│   │   └── main.jsx         # Admin entry
│   └── Dockerfile
├── .env.example
├── docker-compose.yml
└── README.md
```

## Environment Variables

Copy `.env.example` to `.env` and configure:

| Variable | Description |
|----------|-------------|
| `PORT` | Server port |
| `NODE_ENV` | development/production |
| `MONGODB_URI` | MongoDB connection string |
| `REDIS_URL` | Redis connection string |
| `JWT_SECRET` | JWT signing secret |
| `CLOUDINARY_*` | Cloudinary credentials for image uploads |
| `SMTP_*` | SMTP settings for email |

## Architecture

### Backend (Clean Architecture)
- **Models** define data schemas with indexes and validation
- **Services** (BaseService) provide CRUD operations with pagination
- **Controllers** (createController factory) handle HTTP requests/responses
- **Middleware** handles auth, RBAC, rate limiting, sanitization, errors
- Routes are protected with role-based access control (RBAC)

### Frontend (Feature-Based)
- Components organized in `components/` (UI primitives, layout components)
- Pages organized in `pages/` by portal type (public, admin, student, teacher)
- Services handle API communication with axios interceptors
- Context providers manage auth state, theme, and language
- Code splitting via React.lazy + Suspense for optimized bundle sizes
```

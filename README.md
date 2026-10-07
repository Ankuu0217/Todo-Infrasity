# Note-Taking Application

A full-stack note-taking application built with Node.js, Express, MongoDB, and React.

## Features

- **Authentication** — Sign up and sign in with JWT-based authentication
- **Notes CRUD** — Create, view, edit, and delete personal notes
- **User isolation** — Each user can only access their own notes
- **Search** — Filter notes by title or content
- **Responsive UI** — Apple-inspired clean, minimal design

## Tech Stack

| Layer      | Technology                           |
| ---------- | ------------------------------------ |
| Frontend   | React, React Router, Axios, Vite    |
| Backend    | Node.js, Express 5, Mongoose        |
| Database   | MongoDB 7                            |
| Auth       | JSON Web Tokens (bcrypt for hashing) |
| Containers | Docker, Docker Compose               |

## Project Structure

```
Infrasity/
├── backend/
│   ├── src/
│   │   ├── config/db.js           # MongoDB connection
│   │   ├── controllers/           # Auth & Note controllers
│   │   ├── middleware/            # Auth, error handler, validators
│   │   ├── models/                # User & Note Mongoose models
│   │   ├── routes/                # Auth & Note routes
│   │   └── app.js                 # Express app setup
│   ├── server.js                  # Entry point
│   ├── Dockerfile
│   ├── .env.example
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/            # Navbar, NoteCard, Modals
│   │   ├── context/               # Auth & Toast contexts
│   │   ├── pages/                 # Login, Signup, Dashboard
│   │   ├── services/              # API service layer
│   │   ├── index.css              # Design system
│   │   ├── App.jsx                # Router & providers
│   │   └── main.jsx               # Entry point
│   ├── Dockerfile
│   ├── .env.example
│   └── package.json
├── docker-compose.yml
└── README.md
```

## Getting Started

### Prerequisites

- Node.js 22+
- MongoDB (local or Docker)
- Docker & Docker Compose (for containerized setup)

### Option 1: Docker Compose (Recommended)

```bash
# Clone the repo and navigate to the project
cd Infrasity

# Set your JWT secret
echo 'JWT_SECRET=your_super_secret_key_here' > .env

# Build and start all services
docker compose up --build
```

The app will be available at:
- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:5000/api
- **Health check:** http://localhost:5000/api/health

### Option 2: Local Development

**1. Start MongoDB** (if not using Docker):
```bash
mongod
```

**2. Start the backend:**
```bash
cd backend
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secret
npm install
npm run dev
```

**3. Start the frontend:**
```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

## Environment Variables

### Backend (`backend/.env`)

| Variable     | Description              | Default                                  |
| ------------ | ------------------------ | ---------------------------------------- |
| PORT         | Server port              | 5000                                     |
| NODE_ENV     | Environment              | development                              |
| MONGODB_URI  | MongoDB connection URI   | mongodb://localhost:27017/notetaking      |
| JWT_SECRET   | JWT signing secret       | *(must set)*                             |
| JWT_EXPIRES_IN | Token expiration       | 7d                                       |
| CORS_ORIGIN  | Allowed frontend origin  | http://localhost:5173                     |

### Frontend (`frontend/.env`)

| Variable      | Description    | Default                    |
| ------------- | -------------- | -------------------------- |
| VITE_API_URL  | Backend API URL | http://localhost:5000/api  |

## API Endpoints

### Auth
| Method | Endpoint         | Description         | Auth |
| ------ | ---------------- | ------------------- | ---- |
| POST   | /api/auth/signup  | Register new user  | No   |
| POST   | /api/auth/login   | Login & get token  | No   |
| GET    | /api/auth/me      | Get current user   | Yes  |

### Notes
| Method | Endpoint          | Description         | Auth |
| ------ | ----------------- | ------------------- | ---- |
| GET    | /api/notes        | Get all user notes  | Yes  |
| GET    | /api/notes/:id    | Get single note     | Yes  |
| POST   | /api/notes        | Create note         | Yes  |
| PUT    | /api/notes/:id    | Update note         | Yes  |
| DELETE | /api/notes/:id    | Delete note         | Yes  |

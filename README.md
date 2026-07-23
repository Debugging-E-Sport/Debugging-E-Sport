<p align="center">
  <h1 align="center">🐛 Bug Brawl</h1>
  <p align="center">
    <strong>Multiplayer Real-Time Debugging Competition Platform</strong>
  </p>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white" alt="React">
  <img src="https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white" alt="Vite">
  <img src="https://img.shields.io/badge/Tailwind-4-06B6D4?logo=tailwindcss&logoColor=white" alt="Tailwind">
  <img src="https://img.shields.io/badge/Express-5-000000?logo=express&logoColor=white" alt="Express">
  <img src="https://img.shields.io/badge/Socket.IO-4-010101?logo=socket.io&logoColor=white" alt="Socket.IO">
  <img src="https://img.shields.io/badge/PostgreSQL-4169E1?logo=postgresql&logoColor=white" alt="PostgreSQL">
  <img src="https://img.shields.io/badge/Sequelize-52B0E7?logo=sequelize&logoColor=white" alt="Sequelize">
  <img src="https://img.shields.io/badge/DeepSeek-AI-4D6BFE?logo=openai&logoColor=white" alt="DeepSeek AI">
  <img src="https://img.shields.io/badge/license-MIT-green" alt="License">
</p>

---

## 📖 About

**Bug Brawl** is a multiplayer real-time debugging competition platform where developers can create rooms, invite friends, and compete to find and fix bugs in code snippets. Powered by **DeepSeek AI** for intelligent answer scoring, the platform delivers a competitive e-sport experience for programmers.

### ✨ Features

- 🔐 **Authentication** — Register/Login with JWT-based auth
- 🏠 **Room System** — Create rooms with invite codes, join as participant
- ⚡ **Real-Time Gameplay** — Socket.IO-powered live game flow
- 🧩 **12 Debugging Challenges** — Easy, Medium, and Hard code snippets with hidden bugs
- 🤖 **AI Scoring** — DeepSeek AI evaluates answer accuracy and awards points
- 🏆 **Live Leaderboard** — Real-time score updates during gameplay
- 📖 **Swagger API Docs** — Full OpenAPI 3.0 documentation

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                       🌐 bugbrawl.sparda.id                  │
│                    (React + Vite Frontend)                   │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌─────────────┐ │
│  │  Login   │  │  Lobby   │  │   Game   │  │ Leaderboard │ │
│  │ Register │  │ (Rooms)  │  │ (Sockets)│  │  Game Over  │ │
│  └──────────┘  └──────────┘  └──────────┘  └─────────────┘ │
└──────────────────────┬──────────────────────────────────────┘
                       │  HTTP REST + WebSocket (Socket.IO)
                       ▼
┌─────────────────────────────────────────────────────────────┐
│                     🚀 bbapi.sparda.id                       │
│                  (Express 5 + Socket.IO)                     │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌─────────────┐ │
│  │   Auth   │  │   Room   │  │ Snippet  │  │    Score    │ │
│  │  Router  │  │  Router  │  │  Router  │  │   Router    │ │
│  └──────────┘  └──────────┘  └──────────┘  └─────────────┘ │
│  ┌──────────────────────────────────────────────────────────┐│
│  │              Socket.IO Game Handler                       ││
│  │    join → leave → ready → start → submit → next-round    ││
│  └──────────────────────────────────────────────────────────┘│
│  ┌──────────┐  ┌──────────────────────────────────────────┐ │
│  │ Swagger  │  │         🤖 DeepSeek AI Scoring            │ │
│  │ /api-docs│  │   Evaluates debug answers, awards points  │ │
│  └──────────┘  └──────────────────────────────────────────┘ │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│                  🗄️ PostgreSQL (Supabase)                    │
│  Users │ Rooms │ RoomParticipants │ Snippets │ Scores       │
└─────────────────────────────────────────────────────────────┘
```

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** >= 20
- **PostgreSQL** database (or Supabase)
- **DeepSeek API key** (for AI scoring)

### 1. Clone & Install

```bash
git clone git@github.com:Debugging-E-Sport/Debugging-E-Sport.git
cd Debugging-E-Sport

# Install backend dependencies
cd server
npm install

# Install frontend dependencies
cd ../client
npm install
```

### 2. Configure Environment

**Server** (`server/.env`):

```env
JWT_KEY=your_jwt_secret_here
DATABASE_URL=postgresql://postgres:***@host:5432/dbname
NODE_ENV=development
DEEPSEEK_API_KEY=sk-your-deepseek-key
PORT=3000
```

**Client** (`client/.env`):

```env
VITE_API_URL=http://localhost:3000/api
VITE_SOCKET_URL=http://localhost:3000
```

### 3. Database Setup

```bash
cd server
npx sequelize-cli db:migrate
npx sequelize-cli db:seed:all    # Load 12 debugging snippets
```

### 4. Run

```bash
# Terminal 1 — Backend
cd server && npm run dev
# → Bug Brawl server listening on port 3000

# Terminal 2 — Frontend (with mock socket for local dev)
cd client && npm run dev
# → Vite dev server on http://localhost:5173
```

---

## 🔗 Links

| Resource | URL |
|----------|-----|
| 🎮 **Frontend** | [bugbrawl.sparda.id](https://bugbrawl.sparda.id) |
| 🚀 **Backend API** | [bbapi.sparda.id](https://bbapi.sparda.id) |
| 📖 **Swagger Docs** | [bbapi.sparda.id/api-docs](https://bbapi.sparda.id/api-docs) |
| 📄 **API Spec (JSON)** | [bbapi.sparda.id/api-docs.json](https://bbapi.sparda.id/api-docs.json) |
| 📋 **GitHub Repo** | [Debugging-E-Sport](https://github.com/Debugging-E-Sport/Debugging-E-Sport) |

### API Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `POST` | `/api/auth/register` | Register new account | No |
| `POST` | `/api/auth/login` | Login, get JWT token | No |
| `GET` | `/api/auth/me` | Get current user info | JWT |
| `POST` | `/api/rooms` | Create a game room | JWT |
| `GET` | `/api/rooms` | List available rooms | JWT |
| `GET` | `/api/rooms/:code` | Get room details | JWT |
| `POST` | `/api/rooms/:code/join` | Join room by code | JWT |
| `GET` | `/api/snippets` | List all code snippets | JWT |
| `GET` | `/api/snippets/random` | Get random snippet | JWT |
| `GET` | `/api/snippets/:id` | Get snippet detail | JWT |
| `POST` | `/api/scores` | Submit score | JWT |
| `GET` | `/api/scores/leaderboard/:roomId` | Room leaderboard | JWT |

---

## 👥 Team

| Name | GitHub | Role |
|------|--------|------|
| **Adrianto Puji Irawan** | [@adriantoirawan](https://github.com/adriantoirawan) | Full Stack & AI Integration |
| **M. Althaf Kiram** | [@malthafkiram](https://github.com/malthafkiram) | Backend & Database |
| **RESKY SAPUTRA** | [@dopevwxyz](https://github.com/dopevwxyz) | Frontend & UI/UX |

---

## 📄 License

MIT © 2026 Debugging E-Sport — see [LICENSE](LICENSE)

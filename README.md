# 🚀 ProjectHub — Full-Stack Project Management App

A production-ready Project Management Web Application built with the **MERN stack** (MongoDB, Express, React, Node.js) featuring **role-based access control** (Admin & Member).

---

## ✨ Features

- 🔐 **JWT Authentication** — Signup, Login, Protected routes
- 👥 **Role-Based Access Control** — Admin & Member roles
- 📁 **Project Management** — Create, view, delete projects; add members
- ✅ **Task Management** — Create, assign, update, delete tasks with deadlines
- 📊 **Dashboard** — Live stats: total, completed, in-progress, overdue tasks
- 📱 **Responsive Design** — Mobile + Desktop ready

---

## 🛠 Tech Stack

| Layer      | Tech                          |
|------------|-------------------------------|
| Frontend   | React 18 + Vite, Tailwind CSS, React Router v6, Axios |
| Backend    | Node.js, Express.js           |
| Database   | MongoDB + Mongoose            |
| Auth       | JWT + bcryptjs                |
| Deployment | Railway (backend), Vercel (frontend), MongoDB Atlas (DB) |

---

## 📁 Project Structure

```
project-management-app/
├── backend/
│   ├── controllers/     # Business logic
│   ├── models/          # Mongoose schemas
│   ├── routes/          # API routes
│   ├── middleware/       # Auth + Role middleware
│   ├── server.js        # Entry point
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── components/  # Reusable UI components
│   │   ├── pages/       # Page components
│   │   ├── services/    # Axios API calls
│   │   ├── context/     # Auth context (global state)
│   │   └── App.jsx
│   └── .env.example
└── README.md
```

---

## ⚙️ Local Setup (VS Code)

### Prerequisites
- Node.js v18+ installed → https://nodejs.org
- MongoDB Atlas account (free) → https://mongodb.com/atlas
- VS Code → https://code.visualstudio.com

### Step 1 — Clone / Unzip the project
```bash
cd Desktop
# If cloning from GitHub:
git clone <your-repo-url> project-management-app
cd project-management-app
```

### Step 2 — Setup Backend
```bash
cd backend
npm install
cp .env.example .env
```

Edit `.env`:
```env
PORT=5000
MONGO_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/projectmanagement
JWT_SECRET=any_long_random_secret_string
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

Start backend:
```bash
npm run dev
# Server runs on http://localhost:5000
```

### Step 3 — Setup Frontend
Open a **new terminal** in VS Code:
```bash
cd frontend
npm install
cp .env.example .env
```

Edit `.env`:
```env
VITE_API_URL=http://localhost:5000/api
```

Start frontend:
```bash
npm run dev
# App runs on http://localhost:3000
```

### Step 4 — Open App
Visit **http://localhost:3000** → Sign up as Admin → Start creating projects & tasks!

---

## 🌐 Deployment

### 1. MongoDB Atlas (Database)
1. Go to https://mongodb.com/atlas → Create free cluster
2. Create a database user (username + password)
3. Whitelist IP: `0.0.0.0/0` (allow all) in Network Access
4. Copy the **Connection String**: `mongodb+srv://user:pass@cluster.mongodb.net/projectmanagement`

### 2. Railway (Backend)
1. Go to https://railway.app → Sign up / Login
2. Click **New Project** → **Deploy from GitHub repo**
3. Select your backend repository (push only `/backend` folder or a separate repo)
4. Go to **Variables** tab and add:
   ```
   PORT=5000
   MONGO_URI=<your Atlas connection string>
   JWT_SECRET=<your secret>
   NODE_ENV=production
   FRONTEND_URL=https://your-vercel-app.vercel.app
   ```
5. Go to **Settings** → set **Root Directory** to `backend` if using monorepo
6. Railway auto-deploys. Copy the Railway URL (e.g., `https://your-app.railway.app`)

### 3. Vercel (Frontend)
1. Go to https://vercel.com → Sign up / Login
2. Click **Add New Project** → Import your GitHub repo
3. Set **Root Directory** to `frontend`
4. Add **Environment Variable**:
   ```
   VITE_API_URL=https://your-app.railway.app/api
   ```
5. Click **Deploy** — Vercel builds and gives you a live URL!

---

## 🔑 API Endpoints

| Method | Endpoint              | Access  | Description          |
|--------|-----------------------|---------|----------------------|
| POST   | /api/auth/signup      | Public  | Register user        |
| POST   | /api/auth/login       | Public  | Login user           |
| GET    | /api/auth/me          | Private | Get current user     |
| GET    | /api/projects         | Private | Get projects         |
| POST   | /api/projects         | Admin   | Create project       |
| DELETE | /api/projects/:id     | Admin   | Delete project       |
| GET    | /api/tasks            | Private | Get tasks            |
| POST   | /api/tasks            | Admin   | Create task          |
| PUT    | /api/tasks/:id        | Private | Update task          |
| DELETE | /api/tasks/:id        | Admin   | Delete task          |
| GET    | /api/tasks/stats      | Private | Dashboard stats      |
| GET    | /api/users/members    | Admin   | Get all members      |

---

## 👥 Roles

| Feature              | Admin | Member |
|----------------------|-------|--------|
| Create Projects      | ✅    | ❌     |
| Delete Projects      | ✅    | ❌     |
| Add Members          | ✅    | ❌     |
| Create Tasks         | ✅    | ❌     |
| Delete Tasks         | ✅    | ❌     |
| Assign Tasks         | ✅    | ❌     |
| View all projects    | ✅    | ❌     |
| View assigned projects| ✅   | ✅     |
| Update task status   | ✅    | ✅     |

---

## 📝 License
MIT

# 🌿 ARVYA.X - Wellness Session Platform

A secure full-stack wellness session platform enabling users to create, manage, and share wellness sessions like yoga, meditation, and mindfulness practices. Built with JWT authentication, real-time auto-save functionality, and a modern responsive UI.

---

## 🎯 Objective

This application allows users to:

- ✅ Register and log in securely  
- ✅ View public wellness sessions (yoga, meditation, etc.)  
- ✅ Draft and publish their own custom sessions  
- ✅ Auto-save drafts as they type (2-second debounce)  

A real-world Arvyax use case demonstrating secure, scalable, and interactive full-stack development.

---

## 🛠 Tech Stack

### Frontend
- React.js with Vite
- React Router DOM
- Axios (with credentials)
- React Hook Form
- React Hot Toast
- Tailwind CSS + DaisyUI

### Backend
- Node.js with Express.js
- MongoDB with Mongoose
- JWT (`jsonwebtoken`) for authentication
- bcryptjs for password hashing
- CORS configuration
- Cookie Parser

### Database
- MongoDB Atlas (Cloud)

### Deployment
- **Frontend**: [Vercel](https://arvyax-wellness.vercel.app)
- **Backend**: [Render](https://arvyax-wellness-backend.onrender.com)
- **Database**: MongoDB Atlas

---

## 🚀 Live Demo

- 🌐 **Frontend**: [arvyax-wellness.vercel.app](https://arvyax-wellness.vercel.app)  
- 🔗 **Backend API**: [arvyax-wellness-backend.onrender.com](https://arvyax-wellness-backend.onrender.com)

---

## ✅ Core Features

### 🔐 Authentication
- `POST /api/auth/register` – Register new users with hashed passwords
- `POST /api/auth/login` – Login using JWT tokens in HTTP-only cookies
- `POST /api/auth/logout` – Securely logout by clearing cookies
- `GET /api/auth/check` – Verify authentication token

### 📘 Session Management API

| Method | Endpoint                         | Description                        | Auth Required |
|--------|----------------------------------|------------------------------------|---------------|
| GET    | /api/sessions                    | Get all public sessions            | No            |
| GET    | /api/my-sessions                 | Get user's sessions (draft + pub)  | Yes           |
| GET    | /api/my-sessions/:id            | View a user session                | Yes           |
| POST   | /api/my-sessions/save-draft     | Save/update a draft session        | Yes           |
| POST   | /api/my-sessions/publish        | Publish a session                  | Yes           |
| DELETE | /api/my-sessions/:id            | Delete a session                   | Yes           |

---

## 🧘 Frontend Pages

| Page            | Route                 | Description                                     |
|-----------------|-----------------------|-------------------------------------------------|
| Sessions        | `/sessions`           | View all public sessions                        |
| Login           | `/login`              | Authentication form                             |
| Register        | `/register`           | User registration                               |
| Dashboard       | `/dashboard`          | User stats and overview                         |
| My Sessions     | `/my-sessions`        | Manage drafts and published sessions            |
| Session Editor  | `/my-sessions/new`    | Create new session                              |
| Session Editor  | `/my-sessions/:id`    | Edit existing session                           |

#### ✏️ Session Editor Features
- ✅ Title input field  
- ✅ Tags (comma-separated)  
- ✅ JSON file URL (with validation)  
- ✅ Auto-save draft (2s debounce)  
- ✅ Toast notifications for save status  
- ✅ Save Draft / Publish buttons  

---

## 📦 Project Structure

```bash
ARVYAX/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── lib/
│   │   └── index.js
│   ├── package.json
│   └── .env
└── frontend/
    ├── src/
    │   ├── api/
    │   ├── components/
    │   ├── pages/
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css
    ├── vercel.json
    ├── package.json
    └── .env
```

## 🔧 Installation & Setup
### 📁 Pre-requisites
Ensure you have the following installed:

Node.js (v16+)

Git

MongoDB Atlas

### 🚀 Step-by-Step Setup
1️⃣ Clone the Repository
```bash
git clone <repository-url>
cd ARVYAX
```
2️⃣ Backend Setup
```bash
cd backend
npm install
```
Create a .env file inside the backend folder:
```bash
# .env
MONGODB_URI=your_mongodb_connection_string
PORT=5001
JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_random
NODE_ENV=development
```
Start the backend development server:
```bash
npm run dev
# Server runs on http://localhost:5001
```
3️⃣ Frontend Setup (in a new terminal)
```bash
cd frontend
npm install
```
Create a .env file inside the frontend folder:
```bash
# .env
VITE_API_URL=http://localhost:5001/api
```
Start the frontend development server:
```bash
npm run dev
# App available at http://localhost:5173
```
## ✅ Quick Test
1. Open http://localhost:5173

2. Register a new account

3. Create and auto-save a draft wellness session

4. Publish and manage your sessions



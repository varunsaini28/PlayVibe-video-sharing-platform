# 🎬 PlayVibe — Full-Stack Video Sharing Platform

> A YouTube-inspired video sharing platform built from scratch with React, Node.js, and MongoDB. Upload videos & shorts, engage with creators, and manage your content — all in one place.

![PlayVibe Banner](https://res.cloudinary.com/demo/image/upload/w_1200,h_400,c_fill,g_auto/sample.jpg)
<img width="1717" height="916" alt="image" src="https://github.com/user-attachments/assets/bee80a8a-40ac-4f71-bea6-0648f425732f" />


---

## 🚀 Live Demo

🔗 **[PlayVibe](https://playvibe-video-sharing-platform-1clinet.onrender.com/)** &nbsp;|&nbsp; 📦 **[GitHub Repo](https://github.com/varunsaini28/PlayVibe-video-sharing-platform.git)**

---

## ✨ Features

### 👤 User & Auth
- JWT-based authentication with HTTP-only cookies
- Sign up with profile photo upload (Cloudinary)
- Forget password flow
- Protected routes with custom `ProtectedRoute` guard

### 📺 Video
- Upload videos with thumbnail (signed Cloudinary upload — no API secret exposed to client)
- Chunked video upload for large files
- Watch video page with auto view count
- Like / Dislike toggle
- Nested comments & replies with author avatars
- Save videos to watch later
- Video recommendations feed

### 🩳 Shorts
- Upload & watch short-form videos (vertical format)
- Swipeable shorts feed
- Like, dislike, comment, reply, save

### 📋 Playlists
- Create and manage playlists
- Add/remove videos from playlists
- Saved playlists page

### 📡 Subscriptions
- Subscribe / unsubscribe to channels
- Dedicated subscriptions feed showing latest content from subscribed channels

### 🎙️ Creator Studio (PT Studio)
- Dashboard with channel analytics
- Content management — edit/delete videos, shorts, playlists
- Revenue page
- Manage individual video/short metadata (title, description, tags)

### 🌐 Global Upload Manager
- Persistent floating upload tracker (bottom-right corner)
- Shows real-time upload progress per file
- Warns before tab close during active uploads
- Auto-dismisses completed uploads after 4s

### 🔍 Misc
- Watch history tracking
- Liked content page
- Saved content page
- Scroll to top on route change
- Mobile responsive UI

---

## 🛠️ Tech Stack

### Frontend
| Tech | Purpose |
|------|---------|
| React 18 | UI framework |
| Redux Toolkit | Global state (user, content, uploads) |
| React Router v6 | Client-side routing |
| Axios | HTTP client |
| Tailwind CSS v4 | Styling |
| Vite | Build tool |
| Socket.IO Client | Real-time features |
| React Icons | Icon library |

### Backend
| Tech | Purpose |
|------|---------|
| Node.js + Express | REST API server |
| MongoDB + Mongoose | Database & ODM |
| JWT + Cookies | Authentication |
| Cloudinary | Media storage (videos, images) |
| Multer | File handling middleware |
| Socket.IO | WebSocket server |
| bcrypt | Password hashing |
| dotenv | Environment config |

---

## 🏗️ Architecture

```
playvibe/
├── frontend/                  # React + Vite app
│   ├── src/
│   │   ├── pages/
│   │   │   ├── auth/          # Signin, Signup, ForgetPassword
│   │   │   ├── content/       # WatchVideoPage, WatchShortPage, Shorts
│   │   │   ├── channel/       # ChannelPage, CreateChannel, ViewChannel
│   │   │   ├── creator/       # PTStudio, CreateVideo, CreateShorts, etc.
│   │   │   └── user/          # Profile, History, Saved, Liked
│   │   ├── component/         # Navbar, Sidebar, GlobalUploadManager, etc.
│   │   ├── redux/             # userSlice, contentSlice, uploadSlice
│   │   ├── customHooks/       # Data-fetching hooks
│   │   └── utils/             # cloudinaryUpload, compressImage, constants
│
└── backend/                   # Express API
    ├── config/                # DB connection, Cloudinary config
    ├── controller/            # Auth, Video, Short, Channel, Playlist
    ├── model/                 # User, Video, Short, Channel, Playlist
    ├── route/                 # API routes
    └── middleware/            # Auth middleware (JWT verify)
```

---

## 🔐 Security Highlights

- **No API secrets on the client** — Cloudinary uploads use signed requests generated server-side
- **HTTP-only cookies** for JWT — prevents XSS token theft
- **Auth middleware** on all protected endpoints
- **Input validation** on all API routes

---

## 📡 API Overview

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/signup` | Register user |
| POST | `/api/auth/signin` | Login |
| GET | `/api/upload/upload-signature` | Get signed Cloudinary upload params |
| POST | `/api/content/upload-video` | Create video record |
| GET | `/api/content/get-all-videos` | Fetch all videos |
| PUT | `/api/content/like-video/:id` | Toggle like |
| PUT | `/api/content/add-comment/:id` | Add comment |
| POST | `/api/content/upload-short` | Create short |
| GET | `/api/content/get-all-shorts` | Fetch all shorts |

---

## ⚙️ Getting Started

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)
- Cloudinary account

### 1. Clone the repo
```bash
git clone https://github.com/varunsaini28/playvibe.git
cd playvibe
```

### 2. Backend setup
```bash
cd backend
npm install
```

Create `backend/.env`:
```env
PORT=8000
MONGO_URL=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLOUDINARY_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

```bash
npm run dev
```

### 3. Frontend setup
```bash
cd frontend
npm install
```

Create `frontend/.env`:
```env
VITE_SERVER_URL=http://localhost:8000
```

```bash
npm run dev
```

---

## 📸 Screenshots

> *(Add your screenshots here)*

| Home Feed | Watch Page | Creator Studio |
|-----------|------------|----------------|
| ![home]() | ![watch]() | ![studio]() |

---

## 🧠 What I Learned

- Implementing **signed Cloudinary uploads** to keep API secrets server-side only
- Building a **chunked file upload** system with real-time progress tracking
- Designing a **Redux-powered global upload manager** that persists across route changes
- Structuring a **full-stack MERN** app with clean separation of concerns
- Using **Socket.IO** for real-time features

---

## 📄 License

MIT © [Varun Saini](https://github.com/varunsaini28)

---

<p align="center">Built with ❤️ by Varun Saini</p>

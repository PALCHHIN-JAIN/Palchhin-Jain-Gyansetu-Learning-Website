# GyaanSetu — E-Learning Platform for Rural Students

**Bridge to Knowledge** | Class 1 to 12 | MERN Stack | Multi-language | Free Education

---

## Features

- **Authentication** — Register/Login with JWT tokens
- **Classes 1-12** — Full NCERT course coverage
- **YouTube Integration** — Chapter-wise video lessons
- **Practice Quizzes** — Subject & chapter-wise with timer, scoring, grading
- **10 Languages** — Hindi, Bengali, Telugu, Marathi, Tamil, Gujarati, Kannada, Punjabi, Odia, English
- **Progress Tracking** — Track completed chapters
- **Points & Badges** — Gamified learning (Beginner → Learner → Advanced → Scholar)
- **Green-White Theme** — Clean, professional, child-friendly UI

---

## Tech Stack

| Layer     | Technology         |
|-----------|--------------------|
| Frontend  | React 18 + Vite    |
| Backend   | Node.js + Express  |
| Database  | MongoDB + Mongoose |
| Auth      | JWT + bcryptjs     |
| Styling   | Pure CSS (no framework) |

---

## Quick Start

### Prerequisites
- Node.js >= 16
- MongoDB running locally OR MongoDB Atlas URI
- Git

---

### Step 1: Clone / Navigate to Project

```bash
cd elearn
```

---

### Step 2: Setup Backend

```bash
cd backend
npm install
```

Edit `.env` if needed (default uses localhost MongoDB):
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/gyaansetu
JWT_SECRET=gyaansetu_secret_key_2024_rural_education
JWT_EXPIRE=7d
```

Start backend:
```bash
# Development (with nodemon)
npm run dev

# OR production
npm start
```

Backend runs on: **http://localhost:5000**

---

### Step 3: Seed Database

In a new terminal:
```bash
cd backend
node seed.js
```

Then seed courses (run AFTER backend is started):
```bash
curl -X POST http://localhost:5000/api/courses/seed
```

OR open in browser: `http://localhost:5000/api/courses/seed` with POST method via Postman.

Demo account created: `demo@gyaansetu.com` / `demo123`

---

### Step 4: Setup Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on: **http://localhost:3000**

---

## Project Structure

```
elearn/
├── backend/
│   ├── models/
│   │   ├── User.js          # User schema with auth
│   │   ├── Course.js        # Course + chapters schema
│   │   ├── Quiz.js          # Quiz + questions schema
│   │   └── Progress.js      # Progress tracking
│   ├── routes/
│   │   ├── auth.js          # /api/auth (register, login, me)
│   │   ├── courses.js       # /api/courses (list, detail, seed)
│   │   ├── quiz.js          # /api/quiz (generate, submit, history)
│   │   └── progress.js      # /api/progress (update, get)
│   ├── middleware/
│   │   └── auth.js          # JWT protect middleware
│   ├── server.js            # Express app entry
│   ├── seed.js              # DB seed script
│   └── .env                 # Environment config
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   └── Navbar.jsx   # Navigation with language switcher
    │   ├── context/
    │   │   ├── AuthContext.jsx  # Auth state management
    │   │   └── LangContext.jsx  # Language state management
    │   ├── pages/
    │   │   ├── Landing.jsx     # Home page
    │   │   ├── Login.jsx       # Login
    │   │   ├── Register.jsx    # Register
    │   │   ├── Dashboard.jsx   # User dashboard
    │   │   ├── Courses.jsx     # Course listing
    │   │   ├── CourseDetail.jsx # Course detail + chapters
    │   │   ├── Quiz.jsx        # Quiz setup
    │   │   └── QuizPlay.jsx    # Quiz play + results
    │   ├── utils/
    │   │   └── translations.js # All 10 language translations
    │   ├── styles/
    │   │   └── global.css      # Complete CSS
    │   ├── App.jsx             # Router + providers
    │   └── main.jsx            # Entry point
    ├── index.html
    ├── vite.config.js
    └── package.json
```

---

## API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/register | Register new user |
| POST | /api/auth/login | Login user |
| GET | /api/auth/me | Get current user (Protected) |
| PUT | /api/auth/language | Update preferred language (Protected) |

### Courses
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/courses | Get all courses |
| GET | /api/courses?class=10 | Get courses by class |
| GET | /api/courses/:id | Get course with chapters |
| POST | /api/courses/seed | Seed all courses |

### Quiz
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/quiz/generate?class=10&subject=Math&chapter=Ch1 | Generate quiz |
| POST | /api/quiz/submit | Submit quiz answers |
| GET | /api/quiz/history | Get user quiz history (Protected) |

### Progress
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/progress/update | Mark chapter complete (Protected) |
| GET | /api/progress/my | Get user progress (Protected) |

---

## Supported Languages

| Code | Language |
|------|----------|
| en | English |
| hi | हिंदी |
| bn | বাংলা |
| te | తెలుగు |
| mr | मराठी |
| ta | தமிழ் |
| gu | ગુજરાતી |
| kn | ಕನ್ನಡ |
| pa | ਪੰਜਾਬੀ |
| or | ଓଡ଼ିଆ |

---

## Using MongoDB Atlas (Cloud DB)

Replace `MONGO_URI` in `.env`:
```
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/gyaansetu?retryWrites=true&w=majority
```

---

## Deployment

### Backend (Render/Railway)
1. Set environment variables
2. Build command: `npm install`
3. Start command: `node server.js`

### Frontend (Vercel/Netlify)
1. Build command: `npm run build`
2. Output dir: `dist`
3. Update API URL in all axios calls to production backend URL

---

## License

Free for educational use. Built for rural India with love.

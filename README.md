# 🏋️ Gymkhana – Gym Subscription, Workout Plan & Diet Management System

A SaaS-level, full-stack web application designed for gym owners, personal fitness trainers, and gym members. Gymkhana features a dark glassmorphic UI, JWT role-based access control (Admin, Trainer, Member), interactive daily workout & diet checklists, progress analytics with Chart.js, CSV export reporting, and automated subscription status engine.

---

## 🌟 Key Features

### 1. 🛡️ Authentication & Role Control (JWT)
- **Roles**: `ADMIN`, `TRAINER`, `MEMBER`.
- Secure password hashing using `werkzeug.security` (bcrypt-compatible).
- JWT Access and Refresh Tokens with automatic header interceptors.

### 2. 👑 Admin Dashboard & Operations
- **KPI Metrics**: Active Members, Total Revenue, Expiring Subscriptions (next 7 days), Active Trainer Load.
- **Analytics Visuals**: Monthly revenue growth charts and subscription tier distribution breakdown.
- **Member Management**: Search, filter by subscription status, assign personal trainers, activate subscription plans.
- **CSV Data Export**: One-click downloadable CSV reports (`gymkhana_members_report.csv`).
- **Plan Management**: Create & update subscription tiers (Duration, Price, Perks).

### 3. 🏋️ Trainer Portal
- **Database-Level Isolation**: Trainers only see their assigned member roster.
- **Workout Plan Builder**: Design routines by day of week, exercise name, target muscle, sets, reps, and rest periods.
- **Diet Plan Builder**: Design daily meals, meal timing, and macronutrient targets (Calories, Protein, Carbs, Fats).
- **Master Templates**: Duplicate master workout/diet templates directly to assigned members in one click.
- **Member Progress Hub**: Track client weight trends, body measurements, BMI calculations, and log check-in notes.

### 4. 🧘 Member Hub & Daily Tracker
- **Subscription Card**: Live days remaining counter with auto-computed status (`ACTIVE`, `EXPIRING_SOON`, `EXPIRED`).
- **Interactive Daily Checklist**: Tick off today's exercises and meals as completed.
- **Progress Tracker**: Log weight and body measurements with interactive Chart.js line charts.
- **Routine Viewers**: Full breakdown of weekly workout programs and macronutrient goals.

---

## 🏗️ Architecture & Project Structure

```
Gymkhana/
├── backend/
│   ├── app/
│   │   ├── models/          # SQLAlchemy ORM Models (User, Trainer, Member, Subscription, Workout, Diet, Progress)
│   │   ├── routes/          # Flask Blueprints (Auth, Admin, Trainer, Member, Plans, Workouts, Diets, Progress)
│   │   ├── services/        # Business Logic Layer (Auth, Subscriptions, Workouts, Diets, Analytics)
│   │   ├── schemas/         # Marshmallow Validation & Serializers
│   │   ├── middleware/      # JWT, Role Decorators, Error Handlers
│   │   ├── utils/           # Helper functions & BMI Calculator
│   │   ├── config.py        # Environment settings (Dev, Testing, Prod)
│   │   ├── extensions.py    # SQLAlchemy, JWT, CORS, Migrate, Marshmallow
│   │   └── __init__.py      # App Factory
│   ├── schema.sql           # Complete MySQL 8.0+ DDL Script
│   ├── seed.py              # Mock data generator (1 Admin, 3 Trainers, 15 Members, 4 Plans, Master Templates)
│   ├── run.py               # Flask Entry Point (Port 5000)
│   ├── config.env           # Environment Variables
│   └── requirements.txt     # Python Dependencies
│
├── frontend/
│   ├── src/
│   │   ├── components/      # Reusable UI (Navbar, Sidebar, StatCard, Modal, ProgressAnalyticsChart, SkeletonLoader)
│   │   ├── context/         # AuthContext, NotificationContext
│   │   ├── hooks/           # useAuth, useFetch, useNotification
│   │   ├── layouts/         # AdminLayout, TrainerLayout, MemberLayout
│   │   ├── pages/           # Admin, Trainer, Member & Auth pages
│   │   ├── services/        # Axios API Client & Interceptors
│   │   ├── App.jsx          # React Router v6 & Protected Routes
│   │   ├── main.jsx         # Entry point
│   │   └── index.css        # Glassmorphism Design System & CSS Variables
│   ├── package.json
│   └── vite.config.js
└── README.md
```

---

## ⚡ Quick Start & Setup Guide

### 1. Prerequisites
- **Python**: 3.11+ (Python 3.12 verified)
- **Node.js**: v18+ (Node v24 verified)
- **Database**: SQLite (default for instant running) or MySQL 8.0+

### 2. Backend Setup
```bash
# 1. Navigate to root directory
cd Gymkhana

# 2. Activate Python Virtual Environment
venv\Scripts\activate     # Windows
# source venv/bin/activate # macOS/Linux

# 3. Install Requirements
pip install -r backend/requirements.txt

# 4. Seed Mock Data (1 Admin, 3 Trainers, 15 Members, Plans, Workouts, Diets, Progress logs)
python backend/seed.py

# 5. Start Backend Server
python backend/run.py
```
*Backend runs at http://127.0.0.1:5000*

### 3. Frontend Setup
```bash
# 1. Open new terminal and navigate to frontend
cd frontend

# 2. Install Dependencies
npm install

# 3. Start Development Server
npm run dev
```
*Frontend runs at http://localhost:5173*

---

## 🔑 Demo Login Accounts

| Role | Email | Password |
| :--- | :--- | :--- |
| **Admin** | `admin@gymkhana.com` | `admin123` |
| **Trainer 1** | `alex.trainer@gymkhana.com` | `trainer123` |
| **Trainer 2** | `sara.trainer@gymkhana.com` | `trainer123` |
| **Member 1** | `john@gmail.com` | `member123` |
| **Member 2** | `emily@gmail.com` | `member123` |

*Note: One-click demo login buttons are also available directly on the login screen.*

---

## 🗄️ MySQL Production Deployment Setup

To switch from SQLite to MySQL:
1. Execute `backend/schema.sql` in MySQL 8.0+:
   ```bash
   mysql -u root -p < backend/schema.sql
   ```
2. Update `backend/config.env`:
   ```env
   DATABASE_URL=mysql+pymysql://<user>:<password>@localhost:3306/gymkhana_db
   ```
3. Run `python backend/seed.py` to seed MySQL database tables.

---

## 🎨 Design System

- **Primary Accent**: `#4F46E5` (Indigo)
- **Secondary Accent**: `#06B6D4` (Cyan)
- **Success / Active**: `#22C55E` (Emerald Green)
- **Dark Background**: `#0F172A` (Slate 900)
- **Frosted Glass Cards**: `rgba(30, 41, 59, 0.7)` with `backdrop-filter: blur(16px)`

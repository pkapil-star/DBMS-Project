<h1 align="center">
  ⚡ SQL Query Analyzer
</h1>

<p align="center">
  <strong>A modern, AI-powered SQL Query Intelligence Platform</strong><br/>
  Analyze, optimize, and track SQL queries in real-time
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16-black?logo=next.js" alt="Next.js" />
  <img src="https://img.shields.io/badge/React-19-61DAFB?logo=react" alt="React" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-4-38B2AC?logo=tailwindcss" alt="Tailwind" />
  <img src="https://img.shields.io/badge/Flask-3-000000?logo=flask" alt="Flask" />
  <img src="https://img.shields.io/badge/MySQL-8-4479A1?logo=mysql&logoColor=white" alt="MySQL" />
</p>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Getting Started](#-getting-started)
- [API Endpoints](#-api-endpoints)
- [Project Structure](#-project-structure)
- [Screenshots](#-screenshots)
- [Contributors](#-contributors)

---

## 🔍 Overview

SQL Query Analyzer is a full-stack web application built as a **DBMS course project**. It provides a sleek, dark-themed dashboard where users can:

- **Submit SQL queries** and receive instant performance analysis
- **Track query history** with scores, severity levels, and execution times
- **View optimization suggestions** with before/after comparisons
- **Register & authenticate** securely with bcrypt-hashed passwords

The platform connects a **Next.js 16** frontend (React 19 + Tailwind CSS 4) to a **Flask** REST API backed by **MySQL**.

---

## ✨ Features

| Feature | Description |
|---|---|
| 🔐 **Authentication** | Login & registration with bcrypt password hashing |
| 📝 **Query Analysis** | Submit SQL queries and get instant performance scores |
| 📊 **Score & Severity** | Color-coded badges (green/yellow/red) for quick assessment |
| 📜 **Query History** | Timestamped log of all analyzed queries, most recent first |
| ⚡ **Optimizations** | View optimized queries with detailed before → after diffs |
| 📋 **Copy to Clipboard** | One-click copy of optimized queries |
| 🌙 **Dark Glassmorphism UI** | Premium dark theme with glass cards, glowing gradients, and micro-animations |
| 📱 **Responsive** | Works seamlessly on desktop, tablet, and mobile |
| 🔌 **REST API** | Clean Flask backend with CORS support |
| ⌨️ **Keyboard Shortcuts** | `Ctrl+Enter` to analyze queries |

---

## 🛠 Tech Stack

### Frontend
- **Framework:** Next.js 16 (App Router)
- **UI Library:** React 19
- **Styling:** Tailwind CSS 4
- **Icons:** Lucide React
- **Charts:** Recharts

### Backend
- **Server:** Flask (Python)
- **Database:** MySQL 8
- **Auth:** bcrypt password hashing
- **CORS:** flask-cors

---

## 🏗 Architecture

```
┌─────────────────────┐        ┌─────────────────────┐
│                     │  HTTP  │                     │
│   Next.js Frontend  │◄──────►│   Flask Backend     │
│   (Port 3000)       │  REST  │   (Port 5000)       │
│                     │        │                     │
│  • Login/Register   │        │  POST /login        │
│  • Analysis Tab     │        │  POST /register     │
│  • History Tab      │        │  POST /analyze      │
│  • Optimization Tab │        │                     │
│                     │        │         │           │
└─────────────────────┘        └─────────┼───────────┘
                                         │
                                         ▼
                               ┌─────────────────────┐
                               │                     │
                               │   MySQL Database    │
                               │   (optimizer_db)    │
                               │                     │
                               │  • users            │
                               │  • queries          │
                               │  • orders           │
                               │  • products         │
                               │  • order_items      │
                               └─────────────────────┘
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** ≥ 18
- **Python** ≥ 3.9
- **MySQL** ≥ 8.0

### 1. Clone the Repository

```bash
git clone https://github.com/pkapil-star/DBMS-Project.git
cd DBMS-Project
```

### 2. Setup MySQL Database

```sql
CREATE DATABASE IF NOT EXISTS optimizer_db;
USE optimizer_db;

CREATE TABLE users (
  user_id INT PRIMARY KEY,
  name VARCHAR(100),
  email VARCHAR(100),
  city VARCHAR(50),
  password_hash VARCHAR(255),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE queries (
  id INT AUTO_INCREMENT PRIMARY KEY,
  query TEXT,
  score INT,
  severity VARCHAR(20),
  execution_time INT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### 3. Start the Flask Backend

```bash
cd smart-sql-backend

# Create virtual environment
python -m venv .venv
source .venv/bin/activate        # Linux/Mac
# .venv\Scripts\activate         # Windows

# Install dependencies
pip install -r requirements.txt

# Update DB credentials in db.py if needed
# Then start the server
python app.py
```

The backend will start on **http://127.0.0.1:5000**

### 4. Start the Next.js Frontend

```bash
# From the project root
npm install
npm run dev
```

The frontend will start on **http://localhost:3000**

### 5. Open the App

1. Navigate to **http://localhost:3000/login**
2. Create an account → Sign in
3. Start analyzing SQL queries!

---

## 📡 API Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `GET` | `/` | Health check | No |
| `POST` | `/register` | Create new user account | No |
| `POST` | `/login` | Authenticate user | No |
| `POST` | `/analyze` | Analyze a SQL query | No |

### Example: Analyze Query

```bash
curl -X POST http://127.0.0.1:5000/analyze \
  -H "Content-Type: application/json" \
  -d '{"query": "SELECT * FROM users WHERE email = '\''test@example.com'\''"}'
```

**Response:**
```json
{
  "query": "SELECT * FROM users WHERE email = 'test@example.com'",
  "score": 80,
  "severity": "LOW",
  "executionTime": 120
}
```

---

## 📁 Project Structure

```
DBMS-Project/
├── app/                        # Next.js App Router pages
│   ├── globals.css             # Global styles & design system
│   ├── layout.tsx              # Root layout with fonts & metadata
│   ├── page.tsx                # Main analyzer dashboard
│   ├── login/
│   │   └── page.tsx            # Login & registration page
│   └── favicon.ico
├── components/                 # React UI components
│   ├── navbar.tsx              # Navigation bar with tabs & logout
│   ├── analysis-tab.tsx        # SQL input & results display
│   ├── history-tab.tsx         # Query history table
│   └── optimization-tab.tsx    # Optimization suggestions
├── lib/
│   └── types.ts                # Shared TypeScript interfaces
├── smart-sql-backend/          # Flask REST API
│   ├── app.py                  # Main Flask application
│   ├── db.py                   # MySQL connection helper
│   ├── optimizer.py            # Query optimization logic
│   └── requirements.txt        # Python dependencies
├── public/                     # Static assets
├── package.json                # Node.js dependencies
├── next.config.ts              # Next.js configuration
├── postcss.config.mjs          # PostCSS / Tailwind config
├── tsconfig.json               # TypeScript configuration
└── README.md
```

---

## 🖼 Screenshots

> _Launch the app locally to see the full UI with glassmorphism effects, glowing gradients, and smooth animations._

### Login Page
- Dark glass-morphism card with animated glowing orbs
- Sign In / Create Account tabs
- Email & password fields with focus glow effects
- GitHub & Google OAuth placeholders

### Analysis Tab
- SQL textarea with syntax-style monospace font
- Score, Severity, and Execution Time metric cards
- Color-coded badges (green ≥80, yellow ≥50, red <50)

### History Tab
- Table view of all analyzed queries
- Sortable by score, severity, and timestamp
- Most recent queries first

### Optimization Tab
- Optimized query display with copy button
- Before → After improvement comparisons

---

## 👥 Contributors

- **Pranshu Kapil** — _Full Stack Development_

---

## 📄 License

This project is part of a DBMS course curriculum. For academic use only.

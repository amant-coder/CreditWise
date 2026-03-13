# CreditWise 💳

A professional full-stack fintech web application for credit score checking and financial health monitoring.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React (Vite) + CSS |
| Backend | Node.js + Express |
| Database | MongoDB (Mongoose) |
| Auth | JWT + bcrypt |
| Charts | Chart.js + react-chartjs-2 |

## Project Structure

```
CreditWise/
├── frontend/          # React app (Vite)
│   └── src/
│       ├── pages/     # All page components
│       ├── components/ # Reusable UI components
│       ├── context/   # Auth context
│       └── services/  # API client
└── backend/           # Node.js + Express API
    ├── models/        # Mongoose schemas
    ├── routes/        # API routes
    └── middleware/    # Auth middleware
```

## Features

- 🏠 **Landing Page** — Hero, features, how it works, FAQ, footer
- 🔐 **Auth** — Register, login, JWT sessions, bcrypt passwords
- 📊 **Dashboard** — Score gauge, factor breakdown, tips, quick actions
- 🔍 **Credit Checker** — 6-factor weighted scoring form with instant results
- 📈 **History** — Chart.js line chart + table with all checks
- 👤 **Profile** — Edit name/phone, security info
- 🛡️ **Admin Panel** — Stats, user management, score distribution chart

## Running the App

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)

### 1. Start Backend
```bash
cd backend
npm install
# Edit .env: set MONGODB_URI and JWT_SECRET
npm run dev
# Runs on http://localhost:5000
```

### 2. Start Frontend
```bash
cd frontend
npm install
npm run dev
# Runs on http://localhost:3002
```

### 3. Create Admin User
After registering a user, update their role in MongoDB:
```js
db.users.updateOne({ email: "admin@example.com" }, { $set: { role: "admin" } })
```

## Environment Variables (backend/.env)
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/creditwise
JWT_SECRET=your_secret_key_here
JWT_EXPIRE=7d
NODE_ENV=development
```

## Credit Score Algorithm

The scoring model mirrors FICO weights:

| Factor | Weight | Description |
|--------|--------|-------------|
| Payment History | 35% | Missed payments penalty |
| Credit Utilization | 30% | Lower is better (target <30%) |
| Credit History Length | 15% | Longer history = higher score |
| Credit Mix | 10% | Cards + loans diversity |
| New Credit | 10% | Penalty for too many cards |

Score range: **300 – 850**

| Range | Category |
|-------|----------|
| 300–579 | Poor |
| 580–669 | Fair |
| 670–739 | Good |
| 740–799 | Very Good |
| 800–850 | Excellent |

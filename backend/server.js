const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const creditRoutes = require('./routes/credit');
const adminRoutes = require('./routes/admin');

const app = express();

/* ---------------- SECURITY MIDDLEWARE ---------------- */
app.use(helmet());
app.use(morgan('dev'));

/* ---------------- CORS CONFIG ---------------- */
app.use(
  cors({
    origin: [
      'http://localhost:3002',
      'http://localhost:5173',
      'https://creditwiser.netlify.app/' // replace later
    ],
    credentials: true
  })
);

/* ---------------- BODY PARSING ---------------- */
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

/* ---------------- ROOT ROUTE ---------------- */
app.get('/', (req, res) => {
  res.json({
    status: 'ok',
    service: 'CreditWise API',
    message: 'Server is running 🚀'
  });
});

/* ---------------- HEALTH CHECK ---------------- */
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'CreditWise API is running',
    timestamp: new Date().toISOString()
  });
});

/* ---------------- API ROUTES ---------------- */
app.use('/api/auth', authRoutes);
app.use('/api/credit', creditRoutes);
app.use('/api/admin', adminRoutes);

/* ---------------- GLOBAL ERROR HANDLER ---------------- */
app.use((err, req, res, next) => {
  console.error('❌ Error:', err.stack);

  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

/* ---------------- 404 HANDLER ---------------- */
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

/* ---------------- DATABASE CONNECTION ---------------- */

const PORT = process.env.PORT || 5000;
const MONGODB_URI =
  process.env.MONGODB_URI || 'mongodb://localhost:27017/creditwise';

mongoose
  .connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log('✅ Connected to MongoDB');

    app.listen(PORT, () => {
      console.log(`🚀 CreditWise Backend running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB connection failed:', err.message);

    console.log('⚠️ Starting server without database connection...');

    app.listen(PORT, () => {
      console.log(
        `🚀 CreditWise Backend running on port ${PORT} (no database)`
      );
    });
  });

module.exports = app;

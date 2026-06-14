const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });

const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const mongoose = require('mongoose');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const cors = require('cors');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorMiddleware');
const contactRoutes = require('./routes/contactRoutes');
const consultationRoutes = require('./routes/consultationRoutes');
const authRoutes = require('./routes/authRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const adminContactRoutes = require('./routes/adminContactRoutes');
const adminConsultationRoutes = require('./routes/adminConsultationRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');
const settingsRoutes = require('./routes/settingsRoutes');
const { publicRouter: homepageStatsPublicRouter, adminRouter: homepageStatsAdminRouter } = require('./routes/homepageStatsRoutes');
const teamRoutes = require('./routes/teamRoutes');
const adminTeamRoutes = require('./routes/adminTeamRoutes');
const { publicRouter: marketDashboardPublicRouter, adminRouter: marketDashboardAdminRouter } = require('./routes/marketDashboardRoutes');
const investmentPlanRoutes = require('./routes/investmentPlanRoutes');
const adminInvestmentPlanRoutes = require('./routes/adminInvestmentPlanRoutes');
const achievementRoutes = require('./routes/achievementRoutes');
const adminAchievementRoutes = require('./routes/adminAchievementRoutes');
const availabilityRoutes = require('./routes/availabilityRoutes');
const adminAvailabilityRoutes = require('./routes/adminAvailabilityRoutes');
const founderRoutes = require('./routes/founderRoutes');
const adminFounderRoutes = require('./routes/adminFounderRoutes');

let server;

process.on('unhandledRejection', (err) => {
  console.error('UNHANDLED REJECTION:', err.message);
  if (server) {
    server.close(() => process.exit(1));
  } else {
    process.exit(1);
  }
});

process.on('uncaughtException', (err) => {
  console.error('UNCAUGHT EXCEPTION:', err.message);
  if (server) {
    server.close(() => process.exit(1));
  } else {
    process.exit(1);
  }
});

const requiredEnvVars = ['MONGO_URI', 'JWT_SECRET'];
requiredEnvVars.forEach((envVar) => {
  if (!process.env[envVar]) {
    console.error(`FATAL: Missing required environment variable: ${envVar}`);
    process.exit(1);
  }
});

connectDB();

const app = express();

app.disable('x-powered-by');

const vitePorts = Array.from({ length: 10 }, (_, i) => `ws://localhost:${5173 + i}`);

const cspConnectSrc = [
  "'self'",
  ...(process.env.CSP_CONNECT_SRC ? process.env.CSP_CONNECT_SRC.split(',').map(s => s.trim()) : []),
];
const cspImgSrc = [
  "'self'",
  'data:',
  'blob:',
  ...(process.env.CSP_IMG_SRC ? process.env.CSP_IMG_SRC.split(',').map(s => s.trim()) : []),
];

// Use backend port from environment to avoid hardcoded localhost:5000
const backendHost = `http://localhost:${process.env.PORT || 5000}`;

if (process.env.NODE_ENV !== 'production') {
  cspConnectSrc.push(backendHost, 'http://localhost:5173', ...vitePorts);
  cspImgSrc.push(backendHost);
}

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: cspImgSrc,
      fontSrc: ["'self'"],
      connectSrc: cspConnectSrc,
      frameSrc: ["'none'"],
      objectSrc: ["'none'"],
    },
  },
  crossOriginEmbedderPolicy: false,
  crossOriginResourcePolicy: { policy: 'cross-origin' },
}));

morgan.token('body', (req) => {
  if (req.method === 'POST' && req.path === '/api/admin/login') return '[REDACTED]';
  return JSON.stringify(req.body);
});

app.use(morgan(':method :url :status :response-time ms - :body'));

const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 500,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests, please try again later',
  },
});
app.use('/api', globalLimiter);

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many login attempts, please try again later',
  },
});
app.use('/api/admin/login', authLimiter);

const contactLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many submissions from this IP, please try again later',
  },
});
app.use('/api/contact', contactLimiter);

const consultationLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many submissions from this IP, please try again later',
  },
});
app.use('/api/consultation', consultationLimiter);

const allowedOrigins = process.env.CLIENT_URL
  ? process.env.CLIENT_URL.split(',').map(s => s.trim())
  : ['http://localhost:5173', 'http://localhost:3000', 'http://localhost:4173', 'http://localhost:5174'];

const wildcardDomains = ['.loca.lt', '.trycloudflare.com', '.vercel.app'];

const originMatches = (origin) => {
  if (allowedOrigins.includes(origin)) return true;
  try {
    const { hostname } = new URL(origin);
    return wildcardDomains.some(d => hostname.endsWith(d));
  } catch { return false; }
};

app.use(cors({
  origin: (origin, cb) => {
    if (!origin) return cb(null, true);
    if (originMatches(origin)) return cb(null, true);
    if (process.env.NODE_ENV !== 'production') return cb(null, true);
    cb(new Error('Not allowed by CORS'));
  },
  credentials: true,
}));

app.use(express.json({ limit: '10kb' }));

app.use(mongoSanitize());

app.use(xss());

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/contact', contactRoutes);
app.use('/api/consultation', consultationRoutes);
app.use('/api/admin', authRoutes);
app.use('/api/admin/dashboard', dashboardRoutes);
app.use('/api/admin/contacts', adminContactRoutes);
app.use('/api/admin/consultations', adminConsultationRoutes);
app.use('/api/admin/analytics', analyticsRoutes);
app.use('/api/admin/settings', settingsRoutes);
app.use('/api/homepage-stats', homepageStatsPublicRouter);
app.use('/api/admin/homepage-stats', homepageStatsAdminRouter);
app.use('/api/team', teamRoutes);
app.use('/api/admin/team', adminTeamRoutes);
app.use('/api/market-dashboard', marketDashboardPublicRouter);
app.use('/api/admin/market-dashboard', marketDashboardAdminRouter);
app.use('/api/plans', investmentPlanRoutes);
app.use('/api/admin/plans', adminInvestmentPlanRoutes);
app.use('/api/achievements', achievementRoutes);
app.use('/api/admin/achievements', adminAchievementRoutes);
app.use('/api/availability', availabilityRoutes);
app.use('/api/admin/availability', adminAvailabilityRoutes);
app.use('/api/founder', founderRoutes);
app.use('/api/admin/founder', adminFounderRoutes);

// NOTE: frontend `dist` serving is moved to the end of the file (after API routes)

app.get('/', (req, res) => {
  res.json({ success: true, message: 'Backend running successfully' });
});

app.get('/api/health', (req, res) => {
  const mongooseState = ['disconnected', 'connected', 'connecting', 'disconnecting'];
  res.json({
    success: true,
    message: 'Server is running',
    data: {
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development',
      mongodb: mongooseState[mongoose.connection.readyState] || 'unknown',
      timestamp: new Date().toISOString(),
    },
  });
});

app.use(errorHandler);

// Serve frontend build when available or when explicitly enabled
const frontendDist = path.resolve(__dirname, '../businessman-portfolio/dist');
if (process.env.NODE_ENV === 'production' || process.env.SERVE_FRONTEND === 'true') {
  app.use(express.static(frontendDist));
  app.get('*', (req, res) => {
    // If request starts with /api or /uploads let API/static handlers above handle it
    if (req.path.startsWith('/api') || req.path.startsWith('/uploads')) return res.status(404).end();
    res.sendFile(path.join(frontendDist, 'index.html'));
  });
}

const PORT = process.env.PORT || 5000;

server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
});

process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully...');
  server.close(() => {
    mongoose.connection.close(false).then(() => {
      console.log('Server shut down complete');
      process.exit(0);
    });
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT received. Shutting down gracefully...');
  server.close(() => {
    mongoose.connection.close(false).then(() => {
      console.log('Server shut down complete');
      process.exit(0);
    });
  });
});

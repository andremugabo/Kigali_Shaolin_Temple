const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');


const app = express();
const PORT = process.env.PORT || 3005;



app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Debug middleware to log requests
app.use((req, res, next) => {
  if (req.url.startsWith('/uploads')) {
    console.log(`[Static Request] ${req.method} ${req.url}`);
  }
  next();
});


const allowedOrigins = [
  'http://localhost',
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:80',
  'http://localhost:3005'
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error(`CORS policy: origin ${origin} not allowed`));
  },
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  credentials: true,
  exposedHeaders: ['Content-Range', 'Accept-Ranges', 'Content-Length'], // Essential for video playback
  optionsSuccessStatus: 200,
}));

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads'), {
  setHeaders: (res, path) => {
    if (path.endsWith('.mp4') || path.endsWith('.webm')) {
      res.set('Accept-Ranges', 'bytes');
    }
  }
}));

const setupSwagger = require('./swagger');



// Routes
const routes = require('./src/routes');
const auditLogRoutes = require('./src/routes/auditLogRoutes');
const { sequelize } = require('./src/models');

app.use('/api', routes);
app.use('/api/audit-logs', auditLogRoutes);

setupSwagger(app);

app.get('/', (req, res) => {
  res.json({ status: 'success', message: 'Kigali Shaolin Temple Backend is Healthy!!!' });
});

app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found.' });
});


app.use((err, req, res, next) => {
  console.error('Server Error:', err);
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'An unexpected error occurred.',
  });
});

// ---------------------
// Start server
// ---------------------
sequelize.sync({ force: false }).then(() => {
  console.log('Database connected and synced');
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}).catch((err) => {
  console.error('Failed to sync database:', err);
});

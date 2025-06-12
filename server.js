const express = require('express');
const dotenv = require('dotenv');
const session = require('express-session');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const formRoutes = require('./routes/formRoutes');
const cors = require('cors');
const path = require('path');
const fs = require('fs'); // Pastikan ini ada jika Anda mempertahankan bagian 'uploads'

dotenv.config();
connectDB();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
// PENTING: Ganti origin ini dengan URL frontend Anda setelah di-deploy!
// Contoh: 'https://nama-aplikasi-frontend-anda.vercel.app'
// Untuk development/testing awal, Anda bisa gunakan '*' TAPI SANGAT TIDAK DIREKOMENDASIKAN UNTUK PRODUKSI.
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000', // Gunakan variabel lingkungan
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from uploads directory (jika masih diperlukan, tapi tidak ada efek di Railway)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use(
  session({
    secret: process.env.SESSION_SECRET || 'mysecret',
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: process.env.NODE_ENV === 'production', // Set secure: true di produksi
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    },
  })
);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/form', formRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal server error', error: err.message });
});

// Catch-all route
app.use((req, res) => {
  res.status(404).json({ message: 'Endpoint not found' });
});

// Ensure uploads directory exists (tidak berlaku di Railway karena ephemeral filesystem)
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)){
  fs.mkdirSync(uploadsDir);
}

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
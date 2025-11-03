require('dotenv').config();
const express = require('express');
const bcrypt = require('bcrypt');
const pool = require('./db');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 4000;
const SALT_ROUNDS = parseInt(process.env.SALT_ROUNDS || '10', 10);

// Basic validators
function validateEmail(email) {
  // simple email regex (sufficient for assignment)
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
}

function validatePhone(phone) {
  // allow digits, optional + at start, remove spaces/dashes before check
  const cleaned = phone.replace(/[\s\-()]/g, '');
  const noPlus = cleaned.startsWith('+') ? cleaned.slice(1) : cleaned;
  return /^\d{7,15}$/.test(noPlus);
}

app.get('/', (req, res) => {
  res.json({ message: 'Registration API running' });
});

app.post('/api/register', async (req, res) => {
  try {
    const { fullName, email, password, phone } = req.body;

    // Validate required fields
    if (!fullName || !email || !password || !phone) {
      return res.status(400).json({ error: 'All fields are required.' });
    }

    if (!validateEmail(email)) {
      return res.status(400).json({ error: 'Invalid email format.' });
    }

    if (typeof password !== 'string' || password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long.' });
    }

    if (!validatePhone(phone)) {
      return res.status(400).json({ error: 'Phone number must be digits (7-15 digits).' });
    }

    // Check if user exists
    const [rows] = await pool.execute('SELECT id FROM users WHERE email = ?', [email]);
    if (rows.length > 0) {
      return res.status(409).json({ error: 'Email already registered.' });
    }

    // Hash password
    const hash = await bcrypt.hash(password, SALT_ROUNDS);

    // Insert into DB (parameterized query)
    const [result] = await pool.execute(
      'INSERT INTO users (full_name, email, password_hash, phone) VALUES (?, ?, ?, ?)',
      [fullName, email, hash, phone]
    );

    // Return success (omit password/hash)
    res.status(201).json({ message: 'User registered successfully.', userId: result.insertId });
  } catch (err) {
    console.error('Registration error: ', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Optional: simple health check route for DB
app.get('/api/health', async (req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({ db: 'ok' });
  } catch (err) {
    res.status(500).json({ db: 'error', error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

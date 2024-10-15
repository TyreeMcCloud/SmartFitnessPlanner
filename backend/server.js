const express = require('express');
const bcrypt = require('bcrypt');
//const jwt = require('jsonwebtoken');
const mysql = require('mysql');
const cors = require('cors');

const app = express();
app.use(express.json());

app.use(cors());

// Database connection (Amazon RDS)
const db = mysql.createConnection({
  host: 'fp-db.cv6gmqoyu9y2.us-east-2.rds.amazonaws.com',
  user: 'admin',
  password: 'group5sql',
  database: 'fitness-planner',
});

db.connect((err) => {
  if (err) {
    console.error('Database connection failed:', err.stack);
    return;
  }
  console.log('Connected to database');
});

// Registration Route
app.post('/api/register', async (req, res) => {
  const { name, email, password, gender, height, weight, age } = req.body;
  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save the user in the database
    const query = 'INSERT INTO User (name, email, password_hash, gender, height, weight, age) VALUES (?, ?, ?, ?, ?, ?, ?)';
    db.query(query, [name, email, hashedPassword, gender, height, weight, age], (err, results) => {
      if (err) return res.status(500).send('Server error');
      res.status(201).send('User registered successfully');
    });
  } catch (error) {
    res.status(500).send('Error registering user');
  }
});

// Login Route
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;

  // Query the database to find the user by email
  const query = 'SELECT * FROM User WHERE email = ?';
  db.query(query, [email], async (err, results) => {
    if (err) return res.status(500).send('Server error');
    
    if (results.length === 0) return res.status(404).send('User not found');

    const user = results[0];

    // Check if the password is correct by comparing with hashed password
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) return res.status(401).send('Incorrect password');

    /* Generate JWT token
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });*/
  });
});

// Start the server
app.listen(5001, () => {
  console.log('Server is running on port 5001');
});
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mysql = require('mysql');

const app = express();
app.use(express.json());

// Database connection (Amazon RDS)
const db = mysql.createConnection({
  host: 'your-rds-endpoint',
  user: 'your-db-username',
  password: 'your-db-password',
  database: 'your-db-name',
});

// Registration Route
app.post('/api/register', async (req, res) => {
  const { email, password } = req.body;
  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save the user in the database
    const query = 'INSERT INTO users (email, password) VALUES (?, ?)';
    db.query(query, [email, hashedPassword], (err, results) => {
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
  const query = 'SELECT * FROM users WHERE email = ?';
  db.query(query, [email], async (err, results) => {
    if (err) return res.status(500).send('Server error');
    
    if (results.length === 0) return res.status(404).send('User not found');

    const user = results[0];

    // Check if the password is correct by comparing with hashed password
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) return res.status(401).send('Incorrect password');

    // Generate JWT token
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  });
});

// Start the server
app.listen(5000, () => {
  console.log('Server is running on port 5000');
});

const express = require('express');
const bcrypt = require('bcrypt');
//const jwt = require('jsonwebtoken');
const mysql = require('mysql');
const cors = require('cors');

const app = express();
app.use(express.json());

app.use((req, res, next) => {
  res.setHeader("Content-Security-Policy", "script-src 'self' 'unsafe-eval';");
  next(); // Pass control to the next middleware
});

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
    // Check if email already exists
    const checkEmailQuery = 'SELECT * FROM User WHERE email = ?';
    db.query(checkEmailQuery, [email], async (err, results) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).send('Server error');
      }
      if (results.length > 0) {
        return res.status(409).send('Email already in use'); // Conflict status
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Save the user in the database
      const insertUserQuery = 'INSERT INTO User (name, email, password_hash, gender, height, weight, age) VALUES (?, ?, ?, ?, ?, ?, ?)';
      db.query(insertUserQuery, [name, email, hashedPassword, gender, height, weight, age], (err, results) => {
        if (err) {
          console.error('Database insert error:', err);
          return res.status(500).send('Server error');
        }
        res.status(201).send('User registered successfully');
      });
    });
  } catch (error) {
    console.error('Error in registration:', error);
    res.status(500).send('Error registering user');
  }
});


// Login Route
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  // Query the database to find the user by email
  const query = 'SELECT * FROM User WHERE email = ?';
  db.query(query, [email], async (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).send('Server error');
    }
    
    if (results.length === 0) {
      return res.status(404).send('User not found');
    }

    const user = results[0];

    // Check if the password is correct by comparing with hashed password
    const passwordMatch = await bcrypt.compare(password, user.password_hash);
    if (!passwordMatch) {
      return res.status(401).send('Incorrect password');
    }

    // Send a success response
    res.status(200).send({ message: 'Login successful' });
  });
});



// Route to get all workout plans (in plain text or other format)
app.get('/api/workout-plans', (req, res) => {
  const query = 'SELECT * FROM Workout_Plan';
  db.query(query, (error, results) => {
    if (error) {
      console.error('Error fetching workout plans:', error);
      res.status(500).json({ message: 'Error fetching workout plans' }); // Return error in JSON
    } else {
      res.json(results); // Send the results back as JSON
    }
  });
});


// Route to create a new workout plan
app.post('/api/workout-plans', (req, res) => {

  console.log('Request body:', req.body);
  const { fitness_goals, workout_days, time_estimate } = req.query; // Use req.query for URL query parameters

  if (!fitness_goals || !workout_days || !time_estimate) {
    console.log('Missing required fields:', { fitness_goals, workout_days, time_estimate });
    return res.status(400).send('Please provide all required fields');
}

  const query = 'INSERT INTO Workout_Plan (fitness_goals, workout_days, time_estimate) VALUES (?, ?, ?)';
  db.query(query, [fitness_goals, workout_days, time_estimate], (error, results) => {
    if (error) {
      console.error('Error creating workout plan:', error);
      res.status(500).send('Error creating workout plan');
    } else {
      res.send('Workout plan created successfully');
    }
  });
});




// Start the server
app.listen(5001, () => {
  console.log('Server is running on port 5001');
});
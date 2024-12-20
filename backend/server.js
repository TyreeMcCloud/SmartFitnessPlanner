const express = require('express');
//const bcrypt = require('bcrypt');
const bcrypt = require('bcryptjs');
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

        // Get the newly created user's ID
        const userId = results.insertId;

        res.status(201).send({ message: 'User registered successfully', user_id: userId,  name: name });
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
     res.status(200).send({ message: 'Login successful', user_id: user.user_id, name: user.name }); // Include `user_id`
  });
});



// Route to get all workout plans (in plain text or other format)
app.get('/api/workout-plans', (req, res) => {

  const { user_id } = req.query;

  if (!user_id) {
    return res.status(400).json({ message: 'User ID is required' });
  }

  // Query to retrieve workout plans only for the specified user
  const query = 'SELECT * FROM Workout_Plan WHERE user_id = ?';
  db.query(query, [user_id], (error, results) => {
    if (error) {
      console.error('Error retrieving workout plans:', error);
      res.status(500).send({ message: 'Error retrieving workout plans' });
    } else {
      res.json(results); // Send back only the workout plans for this user
    }
  });
});


// Route to create a new workout plan
app.post('/api/workout-plans', (req, res) => {

  console.log('Request body:', req.body);
  const { user_id, fitness_goals, workout_days, time_estimate } = req.body; // Use req.query for URL query parameters


  // Check if all required fields are provided
  if (!user_id || !fitness_goals || !workout_days || !time_estimate) {
    console.log('Missing required fields:', { user_id, fitness_goals, workout_days, time_estimate });
    return res.status(400).send('Please provide all required fields');
  }

  const query = 'INSERT INTO Workout_Plan (user_id, fitness_goals, workout_days, time_estimate) VALUES (?, ?, ?, ?)';
  db.query(query, [user_id, fitness_goals, workout_days, time_estimate], (error, results) => {
    if (error) {
      console.error('Error creating workout plan:', error);
      res.status(500).send('Error creating workout plan');
    } else {
      res.send('Workout plan created successfully');
    }
  });
});

//Delete workout plan
app.delete('/api/workout-plans/:id', async (req, res) => {
  const planId = req.params.id;

  try {
    // Assuming you're using a SQL database with a query function
    // Replace with your database's delete query syntax as needed
    const deleteQuery = 'DELETE FROM Workout_Plan WHERE workout_plan_id = ?';
    await db.query(deleteQuery, [planId]);

    res.status(200).json({ message: 'Workout plan deleted successfully' });
  } catch (error) {
    console.error('Error deleting workout plan:', error);
    res.status(500).json({ message: 'Failed to delete workout plan' });
  }
});

// Route to get a specific workout plan by ID
app.get('/api/workout-plans/:id', (req, res) => {
  const planId = req.params.id;

  const query = 'SELECT * FROM Workout_Plan WHERE workout_plan_id = ?'; // Ensure this matches your DB schema
  db.query(query, [planId], (error, results) => {
    if (error) {
      console.error('Error retrieving workout plan:', error);
      return res.status(500).send({ message: 'Error retrieving workout plan' });
    }

    if (results.length === 0) {
      return res.status(404).send({ message: 'Workout plan not found' }); // Handle case where no plan is found
    }

    res.json(results[0]); // Assuming you want to send back a single workout plan
  });
});

app.post('/api/complete-workout', (req, res) => {
  const { user_id, workout_data } = req.body;

  if (!user_id || !workout_data) {
    return res.status(400).send('User ID and workout data are required');
  }

  const sql = `INSERT INTO Progress_Analytics (user_id, workout_data, progress_data) VALUES (?, ?, ?)`;
  db.query(sql, [user_id, workout_data, 'Completed'], (error, results) => {
    if (error) {
      return res.status(500).send('Error marking workout as complete');
    }
    res.status(200).send('Workout marked as complete');
  });
});

// Endpoint to get the number of completed workouts for a user
app.get('/api/workout-progress/:user_id', (req, res) => {
  const { user_id } = req.params;

  const sql = `SELECT COUNT(*) AS completed_workouts FROM Progress_Analytics WHERE user_id = ? AND progress_data = 'Completed'`;
  db.query(sql, [user_id], (error, results) => {
    if (error) {
      return res.status(500).send('Error fetching workout progress');
    }
    res.status(200).json(results[0]);
  });
});

app.post('/api/clear-completed-workouts/:user_id', (req, res) => {
  const { user_id } = req.params;
  console.log(`Clearing completed workouts for user_id: ${user_id}`); // Log user_id
  // SQL to delete completed workouts for the specified user
  const sql = `DELETE FROM Progress_Analytics WHERE user_id = ? AND progress_data = 'Completed'`;
  
  db.query(sql, [user_id], (error, results) => {
    if (error) {
      return res.status(500).send('Error clearing completed workouts');
    }
    res.status(200).json({ message: 'Completed workouts cleared successfully.' });
  });
});

// Update Profile Route
app.put('/api/updateProfile', async (req, res) => {
  const { userId, name, email, gender, height, weight, age } = req.body;

  try {
    // Check if email is already in use by another user (optional)
    const checkEmailQuery = 'SELECT * FROM User WHERE email = ? AND user_id != ?';
    db.query(checkEmailQuery, [email, userId], (err, results) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).send('Server error');
      }
      if (results.length > 0) {
        return res.status(409).send('Email already in use');
      }

      // Update the user information in the database
      const updateUserQuery = 'UPDATE User SET name = ?, email = ?, gender = ?, height = ?, weight = ?, age = ? WHERE user_id = ?';
      db.query(updateUserQuery, [name, email, gender, height, weight, age, userId], (err, results) => {
        if (err) {
          console.error('Database update error:', err);
          return res.status(500).send('Server error');
        }

        res.status(200).send('Profile updated successfully');
      });
    });
  } catch (error) {
    console.error('Error in updating profile:', error);
    res.status(500).send('Error updating profile');
  }
});

// Route to get user data by userId
app.get('/api/getUser/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    const query = 'SELECT * FROM User WHERE user_id = ?';
    db.query(query, [userId], (err, results) => {
      if (err) {
        console.error('Database query error:', err);
        return res.status(500).send('Server error');
      }

      if (results.length === 0) {
        return res.status(404).send('User not found');
      }

      const user = results[0];
      res.json(user); // Return user data as JSON
    });
  } catch (error) {
    console.error('Error fetching user data:', error);
    res.status(500).send('Error fetching user data');
  }
});



// Start the server
app.listen(5001, () => {
  console.log('Server is running on port 5001');
});
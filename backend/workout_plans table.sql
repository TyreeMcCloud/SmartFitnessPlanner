CREATE TABLE workout_plans (
    plan_id INT AUTO_INCREMENT PRIMARY KEY,  -- Unique identifier for each workout plan
    user_id INT NOT NULL,                     -- Foreign key referencing the user
    fitness_goals VARCHAR(255),               -- User's fitness goals
    workout_schedule TEXT,                    -- Structured schedule for workouts
    time_estimate INT,                        -- Estimated time for each workout session
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,  -- Creation timestamp
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP  -- Last updated timestamp
);
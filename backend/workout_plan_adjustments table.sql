CREATE TABLE workout_plan_adjustments (
    adjustment_id INT AUTO_INCREMENT PRIMARY KEY,  -- Unique identifier for each adjustment
    user_id INT NOT NULL,                           -- Foreign key referencing the user
    plan_id INT NOT NULL,                           -- Foreign key referencing the workout plan
    progress_data JSON,                             -- JSON object to store various progress metrics
    updated_goals JSON,                            -- JSON object to store updated fitness goals
    adjustment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,  -- Date of adjustment
    notes TEXT,                                     -- Optional notes from the user about the adjustment
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (plan_id) REFERENCES workout_plans(plan_id)
);

CREATE TABLE User (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    gender ENUM('Male', 'Female', 'Other'),
    height DECIMAL(4, 2),
    weight DECIMAL(5, 2),
    age INT,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);


CREATE TABLE Workout_Plan (
    workout_plan_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    fitness_goals TEXT,
    workout_days VARCHAR(50),
    time_estimate TIME,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES User(user_id)
);


CREATE TABLE Workout_Session (
    session_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    workout_plan_id INT,
    session_date DATE,
    duration TIME,
    metrics TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES User(user_id),
    FOREIGN KEY (workout_plan_id) REFERENCES Workout_Plan(workout_plan_id)
);


CREATE TABLE Friend (
    friend_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    friend_email VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES User(user_id)
);

CREATE TABLE Habit_Tracker_Data (
    tracker_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    habit_type VARCHAR(100),
    completion_date DATE,
    status ENUM('Completed', 'Pending'),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES User(user_id)
);

CREATE TABLE Exercise (
    exercise_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100),
    video_url VARCHAR(255),
    form_tips TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Workout_Exercise (
    workout_exercise_id INT AUTO_INCREMENT PRIMARY KEY,
    workout_plan_id INT,
    exercise_id INT,
    reps INT,
    sets INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (workout_plan_id) REFERENCES Workout_Plan(workout_plan_id),
    FOREIGN KEY (exercise_id) REFERENCES Exercise(exercise_id)
);

CREATE TABLE Notification (
    notification_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    message TEXT,
    sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES User(user_id)
);

CREATE TABLE Progress_Analytics (
    analytics_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    fitness_goals TEXT,
    progress_data INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES User(user_id)
    FOREIGN KEY (fitness_goals) REFERENCES Workout_Plan(fitness_goals)
);


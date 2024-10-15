CREATE TABLE user_profiles (
    profile_id INT AUTO_INCREMENT PRIMARY KEY,  -- Unique identifier for each profile
    user_id INT NOT NULL,                        -- Foreign key referencing the user
    name VARCHAR(100),                           -- User's name
    email VARCHAR(255) NOT NULL UNIQUE,         -- User's email (must be unique)
    gender VARCHAR(10),                          -- User's gender (optional)
    height FLOAT,                                -- User's height (in cm or inches)
    weight FLOAT,                                -- User's weight (in kg or lbs)
    age INT CHECK (age > 0),                     -- User's age (must be a positive number)
    password VARCHAR(255),                       -- User's password (hashed)
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP -- Last updated timestamp
);

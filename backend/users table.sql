CREATE TABLE users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,  -- Unique identifier for each user
    email VARCHAR(255) NOT NULL UNIQUE,      -- User's email (must be unique)
    password VARCHAR(255) NOT NULL,           -- Hashed password
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,  -- Account creation timestamp
    last_login TIMESTAMP,                     -- Timestamp of the last successful login
    failed_login_attempts INT DEFAULT 0,     -- Counter for failed login attempts
    account_locked BOOLEAN DEFAULT FALSE,     -- Flag to indicate if the account is locked
    lockout_time TIMESTAMP                     -- Time of lockout for account
);

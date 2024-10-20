#!/bin/bash

# Navigate to the frontend/smart-fitness-planner directory
cd frontend/smart-fitness-planner || { echo "Directory not found: /SmartFitnessPlanner/frontend/smart-fitness-planner"; exit 1; }

# Function to install Node.js and npm
install_node_npm() {
    echo "Node.js and npm not found. Installing them now..."
    
    # Detect the operating system
    OS=$(uname)
    
    if [[ "$OS" == "Darwin" ]]; then
        # macOS installation
        if ! command -v brew &> /dev/null; then
            echo "Homebrew is not installed. Installing Homebrew first..."
            /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
        fi
        
        echo "Installing Node.js and npm using Homebrew..."
        brew install node
    elif [[ "$OS" == "Linux" ]]; then
        # Linux installation
        echo "Installing Node.js and npm using package manager..."
        sudo apt update
        sudo apt install -y nodejs npm
    else
        echo "Unsupported OS. Please install Node.js and npm manually."
        exit 1
    fi

    echo "Node.js and npm installed successfully."
}

# Check for Node.js
if ! command -v node &> /dev/null; then
    install_node_npm
else
    echo "Node.js is already installed."
fi

# Check for npm
if ! command -v npm &> /dev/null; then
    install_node_npm
else
    echo "npm is already installed."
fi

# Install frontend dependencies
echo "Installing frontend dependencies..."
if npm install; then
    echo "Frontend dependencies installed successfully."
else
    echo "Failed to install frontend dependencies."
    exit 1
fi

# Start the frontend
echo "Starting the frontend..."
npm start &  # Running frontend in the background
FRONTEND_PID=$!  # Capture the frontend process ID

# Wait for frontend to fully start (adjust timeout as needed)
echo "Waiting for frontend to start..."
sleep 15  # Give time for the frontend to start (can be adjusted based on your system's speed)

# Check if the frontend is running
if ps -p $FRONTEND_PID > /dev/null; then
    echo "Frontend started successfully."
else
    echo "Failed to start the frontend."
    exit 1
fi

# Navigate to the backend directory
cd ../../backend || { echo "Backend directory not found"; exit 1; }

# Install backend dependencies
echo "Installing backend dependencies..."
if npm install; then
    echo "Backend dependencies installed successfully."
else
    echo "Failed to install backend dependencies."
    exit 1
fi

# Start the backend
echo "Starting the backend..."
if node server.js; then
    echo "Backend started successfully."
else
    echo "Failed to start the backend."
    exit 1
fi
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

# Install dependencies
echo "Installing dependencies..."
if npm install; then
    echo "Dependencies installed successfully."
else
    echo "Failed to install dependencies."
    exit 1
fi

# Start the project
echo "Starting the project..."
if npm start; then
    echo "Project started successfully."
else
    echo "Failed to start the project."
    exit 1
fi

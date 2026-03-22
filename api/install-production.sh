#!/bin/bash
# Production installation script for cPanel
# Run this in your cPanel terminal

echo "=== Installing Attendio API Dependencies ==="

# Navigate to the correct directory
cd /home/abdikoue/repositories/Attendio/api

# Check if package.json exists
if [ ! -f "package.json" ]; then
    echo "❌ package.json not found in current directory"
    echo "Current directory: $(pwd)"
    echo "Files in directory:"
    ls -la
    exit 1
fi

echo "✅ Found package.json"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Check if installation was successful
if [ $? -eq 0 ]; then
    echo "✅ Dependencies installed successfully"
else
    echo "❌ Failed to install dependencies"
    exit 1
fi

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo "⚠️  Warning: .env file not found"
    echo "Make sure to upload your .env file with database credentials"
fi

echo "🚀 Ready to start the application with: npm start"
echo "Or use the cPanel Node.js interface to start the app"
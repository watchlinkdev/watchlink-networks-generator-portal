#!/bin/bash

# Watchlink Networks Generator Portal - Production Startup Script
# This script starts the application in production mode with PM2

set -e

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m'

print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

# Configuration
APP_DIR="/home/ubuntu/watchlink-portal"
APP_NAME="watchlink-portal"

print_status "Starting Watchlink Networks Generator Portal in production mode..."

# Navigate to application directory
cd $APP_DIR

# Stop existing PM2 process if running
print_status "Stopping existing PM2 processes..."
pm2 stop $APP_NAME || true
pm2 delete $APP_NAME || true

# Start application with PM2
print_status "Starting application with PM2..."
pm2 start npm --name $APP_NAME -- run start

# Save PM2 configuration
print_status "Saving PM2 configuration..."
pm2 save

# Set up PM2 to start on boot
print_status "Setting up PM2 auto-startup..."
pm2 startup systemd -u ubuntu --hp /home/ubuntu

# Show PM2 status
print_status "PM2 Status:"
pm2 status

# Show application logs
print_status "Application logs (last 20 lines):"
pm2 logs $APP_NAME --lines 20

print_success "✅ Application started successfully!"
print_status "Application is running on http://localhost:5000"
print_status "Use 'pm2 logs $APP_NAME' to view logs"
print_status "Use 'pm2 restart $APP_NAME' to restart the application"
print_status "Use 'pm2 stop $APP_NAME' to stop the application"
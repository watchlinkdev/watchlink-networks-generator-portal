#!/bin/bash

# Watchlink Networks Generator Portal - Application Setup Script
# This script clones the repository and sets up the application

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Configuration
APP_DIR="/home/ubuntu/watchlink-portal"
REPO_URL="https://github.com/watchlinkdev/watchlink-networks-generator-portal.git"

print_status "Setting up Watchlink Networks Generator Portal application..."

# Check if directory exists and clone repository
if [ -d "$APP_DIR" ]; then
    print_status "Application directory exists. Checking for existing repository..."
    if [ -d "$APP_DIR/.git" ]; then
        print_status "Repository already cloned. Pulling latest changes..."
        cd $APP_DIR
        git pull origin main
    else
        print_status "Cloning repository to existing directory..."
        cd $APP_DIR
        git clone $REPO_URL .
    fi
else
    print_status "Creating application directory and cloning repository..."
    git clone $REPO_URL $APP_DIR
    cd $APP_DIR
fi

# Install dependencies
print_status "Installing application dependencies..."
npm install

# Create .env file from template if it doesn't exist
if [ ! -f ".env" ]; then
    print_status "Creating .env file from template..."
    cp .env.aws-template .env
    print_warning "⚠️  IMPORTANT: Edit .env file with your actual database credentials!"
    print_warning "    Database URL, session secret, and other environment variables need to be configured."
else
    print_status ".env file already exists. Skipping template creation."
fi

# Set up database (if DATABASE_URL is configured)
if grep -q "^DATABASE_URL=" .env && ! grep -q "^DATABASE_URL=postgresql://username:password@" .env; then
    print_status "Setting up database tables..."
    npm run db:push
    print_success "Database tables created successfully!"
else
    print_warning "⚠️  DATABASE_URL not configured. Database setup skipped."
    print_warning "    Configure your RDS connection in .env and run 'npm run db:push' manually."
fi

# Build the application
print_status "Building application..."
npm run build

print_success "✅ Application setup completed!"
print_status "Next steps:"
echo "1. Configure your .env file with actual database credentials"
echo "2. Test the application: npm run dev"
echo "3. Start production server: npm run start-prod.sh"
echo "4. Configure Nginx reverse proxy"
echo ""
echo "Application directory: $APP_DIR"
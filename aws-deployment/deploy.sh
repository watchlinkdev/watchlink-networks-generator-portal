#!/bin/bash

# Watchlink Networks Generator Portal - AWS Deployment Script
# This script sets up the complete application on AWS EC2

set -e  # Exit on any error

echo "🚀 Starting Watchlink Networks Generator Portal AWS Deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if running as root
if [[ $EUID -eq 0 ]]; then
   print_error "This script should not be run as root. Run as ubuntu user."
   exit 1
fi

# Update system
print_status "Updating system packages..."
sudo apt update && sudo apt upgrade -y

# Install Node.js 20
print_status "Installing Node.js 20..."
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verify Node.js installation
NODE_VERSION=$(node --version)
NPM_VERSION=$(npm --version)
print_success "Node.js installed: $NODE_VERSION"
print_success "NPM installed: $NPM_VERSION"

# Install PostgreSQL client (server will be RDS)
print_status "Installing PostgreSQL client..."
sudo apt install postgresql-client -y

# Install PM2 for process management
print_status "Installing PM2..."
sudo npm install -g pm2

# Install Nginx
print_status "Installing Nginx..."
sudo apt install nginx -y

# Install Git if not present
print_status "Installing Git..."
sudo apt install git -y

# Create application directory
APP_DIR="/home/ubuntu/watchlink-portal"
print_status "Creating application directory: $APP_DIR"
mkdir -p $APP_DIR

# Set up application directory permissions
sudo chown -R ubuntu:ubuntu $APP_DIR
chmod 755 $APP_DIR

print_success "✅ System setup completed!"
print_status "Next steps:"
echo "1. Clone your repository to $APP_DIR"
echo "2. Set up environment variables"
echo "3. Install application dependencies"
echo "4. Configure database connection"
echo "5. Start the application with PM2"
echo ""
echo "Run the setup-app.sh script next to complete the application setup."
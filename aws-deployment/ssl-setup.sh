#!/bin/bash

# SSL Certificate Setup with Let's Encrypt for Watchlink Portal
# This script sets up SSL certificates using Certbot

set -e

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

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

# Check if domain is provided
if [ -z "$1" ]; then
    print_error "Usage: $0 <your-domain.com>"
    print_error "Example: $0 portal.watchlinknetworks.com"
    exit 1
fi

DOMAIN=$1
EMAIL="admin@$DOMAIN"  # Change this to your actual email

print_status "Setting up SSL certificate for domain: $DOMAIN"

# Install snapd if not present
print_status "Installing snapd..."
sudo apt update
sudo apt install snapd -y

# Install certbot
print_status "Installing Certbot..."
sudo snap install core; sudo snap refresh core
sudo snap install --classic certbot

# Create symlink for certbot
sudo ln -sf /snap/bin/certbot /usr/bin/certbot

# Stop nginx temporarily
print_status "Stopping Nginx temporarily..."
sudo systemctl stop nginx

# Get SSL certificate
print_status "Obtaining SSL certificate for $DOMAIN..."
sudo certbot certonly --standalone \
    --non-interactive \
    --agree-tos \
    --email $EMAIL \
    -d $DOMAIN \
    -d www.$DOMAIN

# Update nginx configuration with actual domain
print_status "Updating Nginx configuration..."
sudo sed -i "s/your-domain.com/$DOMAIN/g" /etc/nginx/sites-available/watchlink-portal

# Test nginx configuration
print_status "Testing Nginx configuration..."
sudo nginx -t

# Start nginx
print_status "Starting Nginx..."
sudo systemctl start nginx
sudo systemctl enable nginx

# Set up automatic renewal
print_status "Setting up automatic SSL renewal..."
echo "0 12 * * * /usr/bin/certbot renew --quiet" | sudo crontab -

# Test automatic renewal
print_status "Testing automatic renewal..."
sudo certbot renew --dry-run

print_success "✅ SSL certificate setup completed!"
print_status "Your site is now available at:"
echo "  https://$DOMAIN"
echo "  https://www.$DOMAIN"
print_status "SSL certificate will automatically renew every 90 days."

# Show certificate information
print_status "Certificate information:"
sudo certbot certificates
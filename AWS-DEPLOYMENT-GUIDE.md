# 🚀 AWS Deployment Guide - Watchlink Networks Generator Portal

Complete step-by-step guide to deploy your generator service CRM on Amazon Web Services.

## 📋 Prerequisites

- AWS Account with billing enabled
- Domain name (optional but recommended)
- Basic familiarity with AWS Console and SSH

## 🏗️ AWS Infrastructure Setup

### Step 1: Launch EC2 Instance

1. **Go to AWS Console → EC2 → Launch Instance**

2. **Choose AMI:**
   - Select **Ubuntu Server 22.04 LTS** (Free Tier eligible)

3. **Choose Instance Type:**
   - **t3.small** (minimum recommended) - ~$15-20/month
   - **t3.medium** (better performance) - ~$30-35/month

4. **Configure Instance:**
   - **Storage:** 20-30 GB SSD
   - **Security Group:** Create new with these rules:
     - SSH (22) - Your IP only
     - HTTP (80) - Anywhere (0.0.0.0/0)
     - HTTPS (443) - Anywhere (0.0.0.0/0)
     - Custom TCP (5000) - Your IP only (for testing)

5. **Key Pair:**
   - Create new key pair or use existing
   - Download and save securely

6. **Launch Instance**

### Step 2: Set Up RDS PostgreSQL Database

1. **Go to AWS Console → RDS → Create Database**

2. **Database Creation Method:**
   - Choose **Standard Create**

3. **Engine Options:**
   - **Engine Type:** PostgreSQL
   - **Version:** 15.x (latest)

4. **Templates:**
   - **Free Tier** (for testing) or **Production** (for live use)

5. **Settings:**
   - **DB Instance Identifier:** `watchlink-portal-db`
   - **Master Username:** `watchlink_admin`
   - **Master Password:** Generate strong password and save it

6. **Instance Configuration:**
   - **DB Instance Class:** 
     - `db.t3.micro` (Free Tier) - Testing only
     - `db.t3.small` (Production) - Recommended

7. **Storage:**
   - **Storage Type:** gp3
   - **Allocated Storage:** 20 GB (can grow)
   - **Enable auto scaling:** Yes

8. **Connectivity:**
   - **VPC:** Default VPC
   - **Public Access:** No
   - **VPC Security Group:** Create new
     - Name: `watchlink-db-sg`
     - Inbound rule: PostgreSQL (5432) from EC2 security group

9. **Database Authentication:**
   - **Password authentication**

10. **Additional Configuration:**
    - **Initial Database Name:** `watchlink_db`

11. **Create Database**

### Step 3: Configure Security Groups

1. **Update RDS Security Group:**
   - Go to **EC2 → Security Groups**
   - Find your RDS security group
   - Add inbound rule: PostgreSQL (5432) from EC2 instance security group

2. **Note down:**
   - RDS Endpoint (found in RDS Console → Your DB → Connectivity)
   - EC2 Public IP (found in EC2 Console)

## 🚀 Application Deployment

### Step 1: Connect to EC2 Instance

```bash
# Replace with your key file and EC2 public IP
chmod 400 your-key.pem
ssh -i your-key.pem ubuntu@your-ec2-public-ip
```

### Step 2: Download and Run Deployment Scripts

```bash
# Download the deployment repository
git clone https://github.com/watchlinkdev/watchlink-networks-generator-portal.git
cd watchlink-networks-generator-portal

# Make scripts executable
chmod +x aws-deployment/*.sh

# Run system setup
./aws-deployment/deploy.sh
```

**What this script does:**
- Updates system packages
- Installs Node.js 20
- Installs PostgreSQL client
- Installs PM2 for process management
- Installs Nginx web server
- Sets up application directory

### Step 3: Set Up Application

```bash
# Run application setup
./aws-deployment/setup-app.sh
```

**What this script does:**
- Clones/updates application code
- Installs Node.js dependencies
- Creates environment file template
- Builds the application

### Step 4: Configure Environment Variables

```bash
# Edit the environment file
cd /home/ubuntu/watchlink-portal
nano .env
```

**Required Configuration:**
```bash
# Database (replace with your RDS details)
DATABASE_URL=postgresql://watchlink_admin:YOUR_PASSWORD@your-rds-endpoint.region.rds.amazonaws.com:5432/watchlink_db

# Security (generate with: openssl rand -base64 32)
SESSION_SECRET=your-generated-session-secret

# Environment
NODE_ENV=production
PORT=5000

# Domain (if you have one)
APP_DOMAIN=https://your-domain.com
```

### Step 5: Set Up Database Tables

```bash
# Test database connection
npm run db:push

# This creates all required tables for your CRM
```

### Step 6: Start Application

```bash
# Start in production mode
./aws-deployment/start-prod.sh
```

**Verify application is running:**
```bash
# Check PM2 status
pm2 status

# Check application logs
pm2 logs watchlink-portal

# Test application (should return HTML)
curl http://localhost:5000
```

## 🌐 Web Server Configuration

### Step 1: Configure Nginx

```bash
# Copy Nginx configuration
sudo cp aws-deployment/nginx.conf /etc/nginx/sites-available/watchlink-portal

# Update with your domain (replace your-domain.com)
sudo nano /etc/nginx/sites-available/watchlink-portal

# Enable site
sudo ln -s /etc/nginx/sites-available/watchlink-portal /etc/nginx/sites-enabled/

# Remove default site
sudo rm /etc/nginx/sites-enabled/default

# Test configuration
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx
```

### Step 2: Set Up SSL Certificate (If you have a domain)

```bash
# Point your domain to your EC2 public IP first
# Then run SSL setup
./aws-deployment/ssl-setup.sh your-domain.com
```

## 🔍 Testing Your Deployment

### Application Health Check

```bash
# Test the application
curl http://your-ec2-ip

# Test the demo page
curl http://your-ec2-ip/demo

# Check if all services are running
sudo systemctl status nginx
pm2 status
```

### Database Verification

```bash
# Connect to database
psql "postgresql://watchlink_admin:PASSWORD@your-rds-endpoint:5432/watchlink_db"

# List tables (should see all CRM tables)
\dt

# Check sample data
SELECT count(*) FROM customers;
SELECT count(*) FROM quotes;
SELECT count(*) FROM install_orders;
```

## 📊 Application Features Available

Once deployed, your CRM includes:

### ✅ Core Business Modules
- **Customer Management** - Complete lifecycle tracking
- **Quote-to-Install Workflow** - Streamlined business process
- **Employee Time Tracking** - Comprehensive activity logging
- **Inventory Management** - Parts and materials tracking
- **Maintenance Scheduling** - Automated service planning

### ✅ Interactive Demo
- Visit: `http://your-domain.com/demo`
- Test quote approval and conversion
- Add employee time entries
- See real-time database updates

## 🔧 Production Maintenance

### Regular Tasks

```bash
# Update application
cd /home/ubuntu/watchlink-portal
git pull origin main
npm install
npm run build
pm2 restart watchlink-portal

# Check logs
pm2 logs watchlink-portal

# Monitor system resources
htop
df -h

# Database maintenance
# (Connect to RDS and run VACUUM, ANALYZE as needed)
```

### Backup Strategy

1. **Database Backups:**
   - Enable automated backups in RDS (7-35 days retention)
   - Create manual snapshots before major updates

2. **Application Backups:**
   - Code is in GitHub (already backed up)
   - Environment files should be backed up securely

### Monitoring

1. **AWS CloudWatch:**
   - Monitor EC2 CPU, Memory, Disk usage
   - Monitor RDS connections, queries

2. **Application Monitoring:**
   - PM2 provides process monitoring
   - Nginx access logs: `/var/log/nginx/watchlink-portal.access.log`
   - Application logs: `pm2 logs watchlink-portal`

## 💰 Estimated Monthly Costs

### AWS Services
- **EC2 t3.small:** ~$15-20/month
- **RDS db.t3.small:** ~$25-30/month
- **Storage (EBS + RDS):** ~$5-10/month
- **Data Transfer:** ~$1-5/month (typical)
- **Total:** ~$45-65/month

### Optional Additions
- **Domain Name:** ~$10-15/year
- **Route 53 (DNS):** ~$0.50/month
- **CloudFront (CDN):** ~$1-10/month
- **Application Load Balancer:** ~$20/month

## 🆘 Troubleshooting

### Common Issues

**Application won't start:**
```bash
# Check environment variables
cat .env

# Check database connectivity
npm run db:push

# Check Node.js version
node --version  # Should be 20.x

# Check PM2 logs
pm2 logs watchlink-portal --lines 50
```

**Database connection issues:**
```bash
# Test connection manually
psql "postgresql://user:pass@endpoint:5432/db"

# Check security groups
# RDS security group should allow 5432 from EC2 security group

# Check RDS status in AWS Console
```

**Nginx issues:**
```bash
# Check Nginx status
sudo systemctl status nginx

# Check configuration
sudo nginx -t

# Check logs
sudo tail -f /var/log/nginx/error.log
```

## 📞 Support

If you encounter issues:

1. **Check logs:** Application logs, Nginx logs, system logs
2. **Verify configuration:** Environment variables, security groups
3. **Test components:** Database connection, application startup, Nginx config
4. **Monitor resources:** CPU, memory, disk space

---

**🎉 Congratulations! Your Watchlink Networks Generator Portal is now live on AWS!**

Your comprehensive generator service CRM is ready to manage quotes, installations, employee time tracking, and customer relationships at enterprise scale.
-- Watchlink Networks Generator Portal - Database Setup
-- This script sets up the database with proper permissions and initial configuration

-- Connect to your PostgreSQL database and run these commands
-- psql "postgresql://username:password@your-rds-endpoint:5432/watchlink_db"

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create application user (optional - for additional security)
-- CREATE USER watchlink_app WITH PASSWORD 'your-app-password';

-- Grant permissions to application user
-- GRANT CONNECT ON DATABASE watchlink_db TO watchlink_app;
-- GRANT USAGE ON SCHEMA public TO watchlink_app;
-- GRANT CREATE ON SCHEMA public TO watchlink_app;

-- Create sample data (run this after your application creates the tables)
-- This will be inserted automatically by your application, but you can verify:

-- Sample customers
-- INSERT INTO customers (name, email, phone, address, customer_type, status)
-- VALUES 
--   ('John Smith', 'john@example.com', '555-0101', '123 Main St, Anytown, ST 12345', 'residential', 'active'),
--   ('Sarah Johnson', 'sarah@example.com', '555-0102', '456 Oak Ave, Somewhere, ST 67890', 'residential', 'active'),
--   ('Mike Wilson', 'mike@example.com', '555-0103', '789 Pine Rd, Elsewhere, ST 54321', 'commercial', 'active');

-- Verify installation
-- SELECT 'Database setup completed successfully!' as status;
-- SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name;

-- Performance optimization
ANALYZE;

-- Create indexes for better performance (these will be created by your application)
-- But you can manually add additional ones if needed:

-- Additional indexes for reporting
-- CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_quotes_created_at ON quotes(created_at);
-- CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_install_orders_status ON install_orders(status);
-- CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_employee_time_entries_date ON employee_time_entries(date);

-- Display database information
SELECT 
  schemaname as schema,
  tablename as table_name,
  attname as column_name,
  typname as data_type
FROM pg_tables t
JOIN pg_class c ON c.relname = t.tablename
JOIN pg_attribute a ON a.attrelid = c.oid
JOIN pg_type typ ON typ.oid = a.atttypid
WHERE t.schemaname = 'public' 
  AND a.attnum > 0 
  AND NOT a.attisdropped
ORDER BY t.tablename, a.attnum;
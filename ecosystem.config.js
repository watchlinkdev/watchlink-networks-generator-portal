// PM2 Ecosystem Configuration for Watchlink Networks Generator Portal
// This file configures PM2 for production deployment

module.exports = {
  apps: [{
    name: 'watchlink-portal',
    script: 'dist/index.js',
    instances: 1,
    exec_mode: 'cluster',
    
    // Environment variables
    env: {
      NODE_ENV: 'development',
      PORT: 5000
    },
    
    env_production: {
      NODE_ENV: 'production',
      PORT: 5000
    },
    
    // Logging
    log_file: './logs/combined.log',
    out_file: './logs/out.log',
    error_file: './logs/error.log',
    log_type: 'json',
    
    // Process management
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    
    // Graceful shutdown
    kill_timeout: 5000,
    listen_timeout: 10000,
    
    // Health monitoring
    min_uptime: '10s',
    max_restarts: 10,
    
    // Source map support
    source_map_support: true,
    
    // Merge logs from different instances
    merge_logs: true,
    
    // Time zone
    time: true
  }]
};
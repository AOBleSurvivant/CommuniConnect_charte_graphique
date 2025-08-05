module.exports = {
  apps: [
    {
      name: 'communiconnect-server',
      script: 'server/index.js',
      instances: 'max',
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'development',
        PORT: 5000
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 5000,
        JWT_SECRET: process.env.JWT_SECRET,
        MONGODB_URI: process.env.MONGODB_URI,
        REDIS_URL: process.env.REDIS_URL,
        CORS_ORIGIN: process.env.CORS_ORIGIN
      },
      error_file: '/var/log/communiconnect/server-error.log',
      out_file: '/var/log/communiconnect/server-out.log',
      log_file: '/var/log/communiconnect/server-combined.log',
      time: true,
      max_memory_restart: '1G',
      node_args: '--max-old-space-size=1024',
      watch: false,
      ignore_watch: ['node_modules', 'logs'],
      merge_logs: true,
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z'
    }
  ],

  deploy: {
    production: {
      user: 'communiconnect',
      host: process.env.SERVER_IP || 'localhost',
      ref: 'origin/main',
      repo: 'git@github.com:your-username/communiconnect.git',
      path: '/var/www/communiconnect',
      'pre-deploy-local': '',
      'post-deploy': 'npm install && npm run build && pm2 reload ecosystem.config.js --env production',
      'pre-setup': ''
    }
  }
}; 
module.exports = {
  apps: [{
    name: 'cu-finance',
    script: './src/backend/server.js',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '512M',
    env_production: {
      NODE_ENV: 'production',
      PORT: 5000,
    },
  }],
};

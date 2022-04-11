module.exports = {
  apps: [
    {
      name: 'opms-client',
      script: 'build',
      interpreter: 'node@16.14.1',
      env: {
        PM2_SERVE_PORT: 9000,
        PM2_SERVE_SPA: 'true',
      }
    }
  ]
}

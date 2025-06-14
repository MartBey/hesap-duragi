module.exports = {
  apps: [{
    name: "hesap-duragi",
    script: "npm",
    args: "start"
  }],
  deploy: {
    production: {
      user: "root",
      host: "77.90.53.8",
      ref: "origin/main",
      repo: "git@github.com:MartBey/hesap-duragi.git",
      path: "/home/root/hesap-duragi",
      'post-deploy': "npm install && npm run build && pm2 reload ecosystem.config.js --env production"
    }
  }
} 
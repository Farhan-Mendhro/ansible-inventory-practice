const express = require('express');
const path = require('path');
const os = require('os');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'public')));

app.get('/api/status', (req, res) => {
  res.json({
    status: 'online',
    hostname: os.hostname(),
    uptime: Math.floor(process.uptime()),
    nodeVersion: process.version,
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString()
  });
});

app.get('/health', (req, res) => {
  res.json({ status: 'healthy', uptime: Math.floor(process.uptime()) });
});

app.listen(PORT, () => {
  console.log(`\x1b[32m✦ Ansible Dashboard running on port ${PORT}\x1b[0m`);
  console.log(`\x1b[90m  http://localhost:${PORT}\x1b[0m`);
});

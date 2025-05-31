// ecosystem.config.example.js (זה ילך לGit)
module.exports = {
  apps: [
    {
      name: "autix-backend",
      script: "./server/dist/server.js",
      env: {
        NODE_ENV: "production",
        PORT: 3001,
        // משתני הDB יטענו מ-.env אוטומטית
      },
      instances: 1,
      autorestart: true,
      max_memory_restart: "1G",
    },
    {
      name: "autix-frontend",
      script: "npm",
      args: "start -- --hostname 0.0.0.0",
      cwd: "./client", // נתיב יחסי
      env: {
        NODE_ENV: "production",
        PORT: 3000,
      },
      instances: 1,
      autorestart: true,
    },
  ],
};

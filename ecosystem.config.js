module.exports = {

  apps: [

    {

      name: 'autix-backend',

      script: './server/dist/server.js',

      cwd: '/home/bitnami/autix',

      env: {

        NODE_ENV: 'production',

        PORT: 3001,

        DB_HOST: 'ls-ea5376db9fba37d4aa3110b9bcd5e9444859b8e7.c3agfyzyhu1d.eu-central-1.rds.amazonaws.com',

        DB_PORT: '5432',

        DB_NAME: 'postgres',

        DB_USER: 'dbmasteruser',

        DB_PASSWORD: 'K49lCpDXxftGRvT2NEfmmGag',

        SSL: 'required',

        JWT_SECRET: 'autix-production-super-secret-key-2024-DO-NOT-SHARE-3.79.239.100',

        CLIENT_URL: 'http://3.79.239.100',

        API_URL: 'http://3.79.239.100:3001'

      },

      instances: 1,

      autorestart: true,

      watch: false,

      max_memory_restart: '1G'

    },

    {

      name: 'autix-frontend',

      script: 'npm',

      args: 'start -- --hostname 0.0.0.0',

      cwd: '/home/bitnami/autix/client',

      env: {

        NODE_ENV: 'production',

        PORT: 3000,

        NEXT_PUBLIC_API_URL: 'http://3.79.239.100:3001'

      },

      instances: 1,

      autorestart: true,

      watch: false

    }

  ]

};

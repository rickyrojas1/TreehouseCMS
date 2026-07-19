module.exports = ({ env }) => ({
  connection: {
    client: 'postgres',
    connection: {
      host: env('PGHOST', '127.0.0.1'),
      port: env.int('PGPORT', 5432),
      database: env('PGDATABASE', 'strapi'),
      user: env('PGUSER', 'strapi'),
      password: env('PGPASSWORD', 'password'),
      ssl: env.bool('DATABASE_SSL', true)
        ? { rejectUnauthorized: false }
        : false,
      // Railway/network layers can silently drop idle TCP connections.
      // keepAlive helps detect dead sockets before queries fail.
      keepAlive: true,
    },
    pool: {
      min: 0,
      max: env.int('DATABASE_POOL_MAX', 5),
      idleTimeoutMillis: env.int('DATABASE_IDLE_TIMEOUT_MS', 30000),
      acquireTimeoutMillis: env.int('DATABASE_ACQUIRE_TIMEOUT_MS', 60000),
      createTimeoutMillis: env.int('DATABASE_CREATE_TIMEOUT_MS', 30000),
      reapIntervalMillis: 1000,
    },
    acquireConnectionTimeout: env.int('DATABASE_ACQUIRE_CONNECTION_TIMEOUT', 60000),
  },
});

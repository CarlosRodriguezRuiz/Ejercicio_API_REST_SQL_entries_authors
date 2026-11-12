/**
 * CONFIG · Conexión a PostgreSQL
 *
 * Crea un "pool": un grupo de conexiones abiertas que se reutilizan.
 * Lo usan los models (models/*.model.js) y scripts/initDb.js.
 * Los datos de conexión salen del .env (en local) o de Render (DATABASE_URL).
 */
const { Pool } = require("pg");
require("dotenv").config();

// En Render basta con una variable: DATABASE_URL (la "Internal Database URL").
// En local (Docker) usamos las variables DB_HOST, DB_USER...
// DB_SSL=true solo hace falta si te conectas desde fuera de Render (External URL).
const ssl = process.env.DB_SSL === "true" ? { rejectUnauthorized: false } : false;

const pool = process.env.DATABASE_URL
  ? new Pool({ connectionString: process.env.DATABASE_URL, ssl })
  : new Pool({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      port: process.env.DB_PORT,
      database: process.env.DB_DATABASE,
      password: process.env.DB_PASSWORD,
      ssl,
    });

module.exports = pool;

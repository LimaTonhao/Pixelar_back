require("dotenv").config();
const { Pool } = require("pg");

const pool = new Pool({
  // user: 'postgres',
  // host: 'localhost',
  // database: 'pixelar',
  // password: 'admin',
  // port: 3000,
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: 5432,
});

module.exports = pool;

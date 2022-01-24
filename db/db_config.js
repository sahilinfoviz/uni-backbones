require('dotenv').config();
const db = process.env.NODE_ENV === "test" ? "users-test" : "postgres";
const Pool = require('pg').Pool

const pool = new Pool({
  connectionString: `postgres://${process.env.PG_USER}:${process.env.PG_PASSWORD}@${process.env.PG_HOST}:${process.env.PG_PORT}/${db}`
});
module.exports = pool

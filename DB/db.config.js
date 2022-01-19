require('dotenv').config();
const db = process.env.NODE_ENV === "test" ? "users-test" : "testdemo";
const Pool = require('pg').Pool
//Local database
// const pool = new Pool({
//   user: process.env.PG_USER,
//   password: process.env.PG_PASSWORD,
//   database: process.env.PG_DATABASE,
//   host: process.env.PG_HOST,
//   port: process.env.PG_PORT
// })

const pool = new Pool({
  connectionString: `postgres://postgres:sahil1998@localhost:5432/${db}`
});
module.exports = pool

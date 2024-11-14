const mysql = require("mysql2");
require("dotenv").config();
// mysql db configuration
let db = mysql.createPool({
  connectionLimit: 100,
  host: process.env.DB_HOSTNAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE_NAME,
  multipleStatements: true,
  insecureAuth: true,
});

db.getConnection((err,connection)=> {
  if(err)
  throw err;
  console.log('Database connected successfully');
  connection.release();
});

module.exports = db;

const mysql = require("mysql2/promise");
require("dotenv").config();

const pool = mysql.createPool({
  host: process.env.MYSQL_HOST || "localhost",
  user: process.env.MYSQL_USER || "user_test_2025",
  password: process.env.MYSQL_PASSWORD || "123456789",
  database: process.env.MYSQL_NAME || "test_db_2025",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

pool
  .getConnection()
  .then((conn) => {
    console.log("Conexion a mysql oki");
    conn.release();
  })
  .catch((err) => {
    console.log("Error coi la conexión");
  });

module.exports = pool;

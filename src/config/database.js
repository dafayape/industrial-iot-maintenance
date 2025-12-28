import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

const databaseConnectionPool = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
});

async function testDatabaseConnection() {
  try {
    const connection = await databaseConnectionPool.getConnection();
    console.log("[DATABASE] Connection established successfully");
    connection.release();
    return true;
  } catch (error) {
    console.error("[DATABASE] Connection failed:", error.message);
    return false;
  }
}

export { databaseConnectionPool, testDatabaseConnection };

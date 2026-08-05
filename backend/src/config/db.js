const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT, 10) || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'campus360',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0
});

// Test the connection pool
const testConnection = async () => {
  try {
    const connection = await pool.getConnection();
    console.log('MySQL Database connection pool established successfully.');
    connection.release();
  } catch (error) {
    console.warn('MySQL Database connection pool failed to connect. (Verify your local MySQL instance is running and configured correctly). Error:', error.message);
  }
};

testConnection();

module.exports = {
  pool,
  // Helper to execute parameterized queries cleanly
  query: async (sql, params) => {
    try {
      const [results] = await pool.execute(sql, params);
      return results;
    } catch (error) {
      console.error(`Database Query Error: ${error.message} \nQuery: ${sql}`);
      throw error;
    }
  }
};

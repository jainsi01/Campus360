const mysql = require('mysql2/promise');
require('./env');

const useSSL = process.env.DB_SSL === 'true';

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
  keepAliveInitialDelay: 0,

  ...(useSSL && {
    ssl: {
      rejectUnauthorized: false
    }
  })
});

const testConnection = async () => {
  try {
    const connection = await pool.getConnection();

    console.log('MySQL Database connection established successfully.');

    connection.release();
  } catch (error) {
    console.error(
      'MySQL Database connection failed:',
      error.message
    );
  }
};

testConnection();

module.exports = {
  pool,

  query: async (sql, params) => {
    try {
      const [results] = await pool.execute(sql, params);
      return results;
    } catch (error) {
      console.error(
        `Database Query Error: ${error.message}\nQuery: ${sql}`
      );
      throw error;
    }
  }
};
const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');
require('../config/env');

async function runSeed() {
  console.log('--- Campus360 Database Seeder Utility ---');
  
  const host = process.env.DB_HOST || 'localhost';
  const port = parseInt(process.env.DB_PORT, 10) || 3306;
  const user = process.env.DB_USER || 'root';
  const password = process.env.DB_PASSWORD || '';
  const database = process.env.DB_NAME || 'campus360';

  console.log(`Connecting to MySQL server at ${host}:${port}...`);

  let connection;
  try {
    // 1. Connect without selecting database to ensure database exists
    connection = await mysql.createConnection({ host, port, user, password, multipleStatements: true });
    console.log(`Creating database '${database}' if not exists...`);
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${database}\`;`);
    await connection.query(`USE \`${database}\`;`);

    // 2. Read schema.sql
    const schemaPath = path.join(__dirname, '../../../database/schema.sql');
    if (fs.existsSync(schemaPath)) {
      console.log('Applying database schema (schema.sql)...');
      const schemaSql = fs.readFileSync(schemaPath, 'utf8');
      await connection.query(schemaSql);
      console.log('Schema executed successfully.');
    } else {
      console.warn(`schema.sql not found at ${schemaPath}`);
    }

    // 3. Read seed.sql
    const seedPath = path.join(__dirname, '../../../database/seed.sql');
    if (fs.existsSync(seedPath)) {
      console.log('Inserting seed data (seed.sql)...');
      const seedSql = fs.readFileSync(seedPath, 'utf8');
      await connection.query(seedSql);
      console.log('Seed data inserted successfully.');
    } else {
      console.warn(`seed.sql not found at ${seedPath}`);
    }

    console.log('Database seeding process completed successfully!');
  } catch (error) {
    console.error('Seeding process encountered an error:', error.message);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

if (require.main === module) {
  runSeed();
}

module.exports = runSeed;

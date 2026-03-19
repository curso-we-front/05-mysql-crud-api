require('dotenv').config();
const mysql = require('mysql2/promise');

async function migrate() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
  });

  const db = process.env.DB_NAME || 'articles_db';

  await connection.query(`CREATE DATABASE IF NOT EXISTS \`${db}\``);
  await connection.query(`USE \`${db}\``);

  await connection.query(`
    CREATE TABLE IF NOT EXISTS articles (
      id         INT AUTO_INCREMENT PRIMARY KEY,
      title      VARCHAR(255) NOT NULL,
      content    TEXT         NOT NULL,
      author     VARCHAR(100) NOT NULL,
      published  BOOLEAN      NOT NULL DEFAULT false,
      createdAt  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `);

  console.log('✓ Migración completada.');
  await connection.end();
}

migrate().catch((err) => {
  console.error('Error en migración:', err.message);
  process.exit(1);
});

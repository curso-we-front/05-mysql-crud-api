require('dotenv').config();
const mysql = require('mysql2/promise');
const articles = require('../../data/articles.json');

async function seed() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'articles_db',
  });

  await connection.query('TRUNCATE TABLE articles');

  for (const article of articles) {
    await connection.query(
      'INSERT INTO articles (title, content, author, published, createdAt) VALUES (?, ?, ?, ?, ?)',
      [article.title, article.content, article.author, article.published, article.createdAt]
    );
  }

  console.log(`✓ Seed completado: ${articles.length} artículos insertados.`);
  await connection.end();
}

seed().catch((err) => {
  console.error('Error en seed:', err.message);
  process.exit(1);
});

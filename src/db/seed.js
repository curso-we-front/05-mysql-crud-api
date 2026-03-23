require("dotenv").config();
const mysql = require("mysql2/promise");
const articles = require("../../data/articles.json");

async function seed() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || "127.0.0.1",
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "secret",
    database: process.env.DB_NAME || "articles_db",
  });

  await connection.query("TRUNCATE TABLE articles");

  for (const article of articles) {
    await connection.query(
      "INSERT INTO articles (title, content, author, published) VALUES (?, ?, ?, ?)",
      [article.title, article.content, article.author, article.published],
    );
  }

  console.log(`✓ Seed completado: ${articles.length} artículos insertados.`);
  await connection.end();
}

seed().catch((err) => {
  console.error("Error en seed:", err.message);
  process.exit(1);
});

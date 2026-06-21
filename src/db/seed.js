require("dotenv").config()
const mysql = require("mysql2/promise")
const articles = require("../../data/articles.json")

async function seed() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  })

  await connection.query("TRUNCATE TABLE articles")

  for (const article of articles) {
    await connection.query(
      "INSERT INTO articles (title, content, author, published) VALUES (?, ?, ?, ?)",
      [article.title, article.content, article.author, article.published],
    )
  }

  console.log(`✓ Seed completado: ${articles.length} artículos insertados.`)
  await connection.end()
}

seed().catch((err) => {
  console.error("Error en seed:", err.message)
  process.exit(1)
})

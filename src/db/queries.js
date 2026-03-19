const pool = require('./connection');

/**
 * Tarea 1 & 3 & 4 — Obtener artículos con búsqueda y paginación.
 *
 * @param {object} options
 * @param {number} options.page    - Página actual (empieza en 1)
 * @param {number} options.limit   - Artículos por página
 * @param {string} options.search  - Texto a buscar (puede estar vacío)
 * @returns {Promise<{ rows: Array, total: number }>}
 *
 * Pistas:
 *  - Si search no está vacío, añade:  WHERE title LIKE ? OR content LIKE ?
 *    con el valor `%${search}%`
 *  - Usa LIMIT y OFFSET para paginar: OFFSET = (page - 1) * limit
 *  - Ejecuta también un COUNT(*) con las mismas condiciones para obtener total
 *  - pool.query() devuelve [rows, fields]; desestructura solo rows
 */
async function getAllArticles({ page = 1, limit = 10, search = '' } = {}) {
  // TODO: implementar
}

/**
 * Tarea 1 — Obtener un artículo por su ID.
 *
 * @param {number} id
 * @returns {Promise<object|null>} - El artículo o null si no existe
 *
 * Pista: SELECT * FROM articles WHERE id = ?
 *        rows[0] será undefined si no hay resultado → devuelve null
 */
async function getArticleById(id) {
  // TODO: implementar
}

/**
 * Tarea 1 — Crear un nuevo artículo.
 *
 * @param {{ title: string, content: string, author: string, published: boolean }} data
 * @returns {Promise<object>} - El artículo recién creado (con su id)
 *
 * Pista: INSERT INTO articles (title, content, author, published) VALUES (?, ?, ?, ?)
 *        El resultado de INSERT tiene result.insertId con el id generado
 */
async function createArticle({ title, content, author, published = false }) {
  // TODO: implementar
}

/**
 * Tarea 1 — Actualizar un artículo existente.
 *
 * @param {number} id
 * @param {{ title: string, content: string, author: string, published: boolean }} data
 * @returns {Promise<object|null>} - El artículo actualizado o null si no existía
 *
 * Pista: UPDATE articles SET title=?, content=?, author=?, published=? WHERE id=?
 *        result.affectedRows === 0 significa que no existía → devuelve null
 */
async function updateArticle(id, { title, content, author, published }) {
  // TODO: implementar
}

/**
 * Tarea 1 — Eliminar un artículo por su ID.
 *
 * @param {number} id
 * @returns {Promise<boolean>} - true si se eliminó, false si no existía
 *
 * Pista: DELETE FROM articles WHERE id = ?
 *        Comprueba result.affectedRows
 */
async function deleteArticle(id) {
  // TODO: implementar
}

module.exports = { getAllArticles, getArticleById, createArticle, updateArticle, deleteArticle };

const pool = require("./connection");

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
async function getAllArticles({ page = 1, limit = 10, search = "" } = {}) {
  //TODO: implementar
  const pageNumber = Number(page);
  const limitNumber = Number(limit);
  const offset = (pageNumber - 1) * limitNumber;
  let query = `SELECT * FROM articles`;
  let countQuery = `SELECT COUNT(*) AS total FROM articles`;
  let data = [];
  if (search) {
    const searchQuery = ` WHERE title LIKE ? OR content LIKE ?`;
    query = query + searchQuery;
    countQuery = countQuery + searchQuery;
    data = [`%${search}%`, `%${search}%`];
  }

  const [[{ total }]] = await pool.query(countQuery, data);
  const totalPages = Math.ceil(total / limitNumber);

  query = query + ` LIMIT ? OFFSET ?`;
  data.push(limitNumber, offset);
  const [articles] = await pool.query(query, data);

  const result = {
    data: articles,
    pagination: {
      page: pageNumber,
      limit: limitNumber,
      total: total,
      totalPages: totalPages,
    },
  };
  return result;
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
  const query = `SELECT * FROM articles WHERE id = ?`;
  const [article] = await pool.query(query, [id]);
  return article[0] ? article[0] : null;

  //....................
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
  const query = `INSERT INTO articles (title, content, author, published) VALUES (?, ?, ?, ?)`;
  const values = [title, content, author, published];
  const [result] = await pool.query(query, values);
  return getArticleById(result.insertId);
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
  const query = `UPDATE articles SET title=?, content=?, author=?, published=? WHERE id=? `;
  const values = [title, content, author, published, id];
  const [result] = await pool.query(query, values);
  const article = getArticleById(id);
  return result.affectedRows ? article : null;
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
  const query = `DELETE from articles WHERE id = ?`;
  const [result] = await pool.query(query, [id]);
  return result.affectedRows ? true : false;
}

module.exports = {
  getAllArticles,
  getArticleById,
  createArticle,
  updateArticle,
  deleteArticle,
};

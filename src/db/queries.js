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
 *  - { page = 1, limit = 10, search = "" } = {}
 */
async function getAllArticles({ page = 1, limit = 10, search = "" } = {}) {
  let rows;

  if (search) {
    [rows] = await pool.execute(
      "SELECT * FROM articles WHERE title LIKE ? OR content LIKE ?",
      [`%${search}%`, `%${search}%`],
    );
  } else {
    [rows] = await pool.execute("SELECT * FROM articles");
  }

  return rows;
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
  
  const [rows] = await pool.execute("SELECT * FROM articles where id = ?", [
    id,
  ]);
  return rows[0] || null;
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
  
  const [result] = await pool.execute(
    "INSERT INTO articles (title, content, author, published) VALUES (?, ?, ?, ?)",
    [title, content, author, published],
  );

  return {
    id: result.insertId,
    title,
    content,
    author,
    published,
  };
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
async function updateArticle(id, { title, content, author }) {
  const [result] = await pool.execute(
    `UPDATE articles 
     SET title = ?, content = ?, author = ?
     WHERE id = ?`,
    [title, content, author, id],
  );

  if (result.affectedRows === 0) {
    return null;
  }

  const [rows] = await pool.query("SELECT * FROM articles WHERE id = ?", [id]);
  return rows[0];
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
  
  const [result] = await pool.execute("DELETE FROM articles WHERE id = ?", [
    id,
  ]);

  if (result.affectedRows > 0) {
    console.log("Se ha borrado el articulo correctamente");
    return true;
  } else {
    console.log("No se ha borrado el articulo");
    return false;
  }
}

module.exports = {
  getAllArticles,
  getArticleById,
  createArticle,
  updateArticle,
  deleteArticle,
};

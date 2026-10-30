const {
  getAllArticles,
  getArticleById,
  createArticle,
  updateArticle,
  deleteArticle,
} = require('../db/queries');
const asyncHandler = require('../utils/asyncHandler');

/**
 * Tarea 1 & 3 & 4 — GET /articles
 *
 * Extrae page, limit y search de req.query.
 * Llama a getAllArticles() y responde con:
 * {
 *   data: [...],
 *   pagination: { page, limit, total, totalPages }
 * }
 */
const getAll = asyncHandler(async (req, res) => {
  // TODO: implementar
  const articles = await getAllArticles(req.query)
  return res.json(articles)
});

/**
 * Tarea 1 — GET /articles/:id
 *
 * Obtiene el artículo por id.
 * Si no existe, responde 404 con { error: 'Artículo no encontrado' }.
 */
const getOne = asyncHandler(async (req, res) => {
  // TODO: implementar
  const id = req.params.id
  const article = await getArticleById(id)
  if(!article){ 
    return res.status(404).json({ error: 'Artículo no encontrado' })
  }
  return res.json(article)
});

/**
 * Tarea 1 — POST /articles
 *
 * Crea un artículo con req.body.
 * Responde 201 con el artículo creado.
 */
const create = asyncHandler(async (req, res) => {
  // TODO: implementar
  const data = req.body
  const newArticle = await createArticle(data)
  return res.status(201).json(newArticle)
});

/**
 * Tarea 1 — PUT /articles/:id
 *
 * Actualiza el artículo con req.body.
 * Si no existe, responde 404 con { error: 'Artículo no encontrado' }.
 */
const update = asyncHandler(async (req, res) => {
  // TODO: implementar
  const id = req.params.id
  const data = req.body
  const article = await updateArticle(id, data)  
  if (!article) {
    return res.status(404).json({ error: 'Artículo no encontrado' })
  }
  return res.json(article)
});

/**
 * Tarea 1 — DELETE /articles/:id
 *
 * Elimina el artículo.
 * Si no existe, responde 404 con { error: 'Artículo no encontrado' }.
 * Si se eliminó, responde 204 sin cuerpo.
 */
const remove = asyncHandler(async (req, res) => {
  // TODO: implementar
  const id = req.params.id
  const isDeleted = await deleteArticle(id)
  if(!isDeleted){
    return res.status(404).json({ error: 'Artículo no encontrado' })
  }
  return res.status(204).send()
});

module.exports = { getAll, getOne, create, update, remove };

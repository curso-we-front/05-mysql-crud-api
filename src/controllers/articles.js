const {
  getAllArticles,
  getArticleById,
  createArticle,
  updateArticle,
  deleteArticle,
} = require("../db/queries")
const asyncHandler = require("../utils/asyncHandler")

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
  const params = {
    page: Number(req.query.page) || 1,
    limit: Number(req.query.limit) || 10,
    search: req.query.search || "",
  }
  const result = await getAllArticles(params)
  res.status(200).json({
    data: result.data,
    pagination: {
      page: result.page,
      limit: result.limit,
      total: result.total,
      totalPages: result.totalPages,
    },
  })
})

/**
 * Tarea 1 — GET /articles/:id
 *
 * Obtiene el artículo por id.
 * Si no existe, responde 404 con { error: 'Artículo no encontrado' }.
 */
const getOne = asyncHandler(async (req, res) => {
  const id = Number(req.params.id)
  const oneArticle = await getArticleById(id)
  if (!oneArticle) {
    return res.status(404).json({ error: "Artículo no encontrado" })
  }
  res.status(200).json(oneArticle)
  // TODO: implementar
})

/**
 * Tarea 1 — POST /articles
 *
 * Crea un artículo con req.body.
 * Responde 201 con el artículo creado.
 */
const create = asyncHandler(async (req, res) => {
  const newArticle = await createArticle(req.body)
  res.status(201).json(newArticle)
  // TODO: implementar
})

/**
 * Tarea 1 — PUT /articles/:id
 *
 * Actualiza el artículo con req.body.
 * Si no existe, responde 404 con { error: 'Artículo no encontrado' }.
 */
const update = asyncHandler(async (req, res) => {
  const id = Number(req.params.id)
  const result = await updateArticle(id, req.body)
  if (!result) {
    return res.status(404).json({ error: "Artículo no encontrado" })
  }
  res.status(200).json(result)
  // TODO: implementar
})

/**
 * Tarea 1 — DELETE /articles/:id
 *
 * Elimina el artículo.
 * Si no existe, responde 404 con { error: 'Artículo no encontrado' }.
 * Si se eliminó, responde 204 sin cuerpo.
 */
const remove = asyncHandler(async (req, res) => {
  const id = Number(req.params.id)
  const result = await deleteArticle(id)
  if (!result) {
    return res.status(404).json({ error: "Artículo no encontrado" })
  }
  res.status(204).send()
  // TODO: implementar
})

module.exports = { getAll, getOne, create, update, remove }

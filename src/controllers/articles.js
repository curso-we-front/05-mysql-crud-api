const {
  getAllArticles,
  getArticleById,
  createArticle,
  updateArticle,
  deleteArticle,
} = require("../db/queries");
const asyncHandler = require("../utils/asyncHandler");

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
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const search = req.query.search || "";

  const allArticles = await getAllArticles({ page, limit, search });
  const total = allArticles.length;
  const totalPages = Math.ceil(total / limit);

  const start = (page - 1) * limit;
  const end = start + limit;
  const data = allArticles.slice(start, end);

  res.status(200).json({
    data,
    pagination: {
      page,
      limit,
      total,
      totalPages,
    },
  });
});

/**
 * Tarea 1 — GET /articles/:id
 *
 * Obtiene el artículo por id.
 * Si no existe, responde 404 con { error: 'Artículo no encontrado' }.
 */
const getOne = asyncHandler(async (req, res) => {
  const idArticle = req.params.id;
  const oneArticle = await getArticleById(idArticle);
  if (!oneArticle) {
    return res.status(404).json({ message: "No existe el artículo" });
  }
  res.status(200).json(oneArticle);
});

/**
 * Tarea 1 — POST /articles
 *
 * Crea un artículo con req.body.
 * Responde 201 con el artículo creado.
 */
const create = asyncHandler(async (req, res) => {
  const { title, content, author, published } = req.body;

  const createdArticle = await createArticle({
    title,
    content,
    author,
    published,
  });

  res.status(201).json(createdArticle);
});

/**
 * Tarea 1 — PUT /articles/:id
 *
 * Actualiza el artículo con req.body.
 * Si no existe, responde 404 con { error: 'Artículo no encontrado' }.
 */
const update = asyncHandler(async (req, res) => {
  
  const id = req.params.id;
  const updated = await updateArticle(id, {
    title: req.body.title,
    content: req.body.content,
    author: req.body.author,
  });

  if (!updated) {
    return res.status(404).json({ message: "Artículo no encontrado" });
  }

  res.status(200).json(updated);
});

/**
 * Tarea 1 — DELETE /articles/:id
 *
 * Elimina el artículo.
 * Si no existe, responde 404 con { error: 'Artículo no encontrado' }.
 * Si se eliminó, responde 204 sin cuerpo.
 */
const remove = asyncHandler(async (req, res) => {
  const idArticle = req.params.id;

  const result = await deleteArticle(idArticle);

  if (!result) {
    return res.status(404).json({ message: "Artículo no encontrado" });
  }

  res.status(204).end();
});

module.exports = { getAll, getOne, create, update, remove };

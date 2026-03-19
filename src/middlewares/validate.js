/**
 * Middleware de validación para el cuerpo de una petición de artículo.
 * Comprueba que title, content y author estén presentes y no vacíos.
 */
function validateArticle(req, res, next) {
  const { title, content, author } = req.body;
  const errors = [];

  if (!title || title.trim() === '') errors.push('title es requerido');
  if (!content || content.trim() === '') errors.push('content es requerido');
  if (!author || author.trim() === '') errors.push('author es requerido');

  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  next();
}

module.exports = { validateArticle };

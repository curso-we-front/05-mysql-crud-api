/**
 * Middleware de manejo global de errores.
 * Debe registrarse al final de app.js (después de todas las rutas).
 *
 * Express lo reconoce como error handler por tener 4 parámetros: (err, req, res, next).
 */
function errorHandler(err, req, res, next) {
  console.error(err);
  const status = err.status || 500;
  res.status(status).json({ error: err.message || 'Error interno del servidor' });
}

module.exports = errorHandler;

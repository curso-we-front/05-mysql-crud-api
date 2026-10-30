/**
 * Tarea 2: Wrapper para handlers async de Express.
 *
 * Elimina la necesidad de escribir try/catch en cada controller.
 * Uso: router.get('/ruta', asyncHandler(async (req, res) => { ... }))
 *
 * @param {Function} fn - Handler async (req, res, next)
 * @returns {Function} - Handler Express que captura errores automáticamente
 */
function asyncHandler(fn) {
  // TODO: implementar
  return async (req, res, next) => {
    try {
      return await fn(req, res, next);
    } catch (error) {
      return next(error);
    }
  };
}

module.exports = asyncHandler;

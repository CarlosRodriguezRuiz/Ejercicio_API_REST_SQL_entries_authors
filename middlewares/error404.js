/**
 * MIDDLEWARE · error404
 *
 * Quién lo usa: app.js, el último. Solo llega aquí una petición que ninguna ruta ha atendido.
 */
// Middleware para cualquier ruta que no exista → 404
// Se pone AL FINAL de app.js, después de todas las rutas
const error404 = (req, res, next) => {
  res.status(404).json({
    success: false,
    message: "404 not found",
    image: "https://http.cat/images/404.jpg",
  });
};

module.exports = error404;

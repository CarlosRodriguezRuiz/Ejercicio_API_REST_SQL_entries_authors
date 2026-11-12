/**
 * ROUTES · /api/authors: qué pasa con cada método HTTP
 *
 * Quién lo usa: app.js → app.use("/api/authors", authorsRoutes)
 * Cada ruta es una cadena de middlewares que se ejecutan en orden:
 *   checkApiKey (solo POST/PUT/DELETE) → validaciones → controller
 * Si uno responde (401, 400...), los siguientes ya no se ejecutan.
 */
const router = require("express").Router();
const authorsController = require("../controllers/authors.controller");
const checkApiKey = require("../middlewares/checkApiKey");
const {
  getAuthorsValidation,
  createAuthorValidation,
  updateAuthorValidation,
  deleteAuthorValidation,
} = require("../validations/authors.validation");

// Orden: ruta → API_KEY → validaciones → controller
// Leer es libre; crear, modificar y borrar necesitan ?API_KEY=...

// GET    /api/authors
// GET    /api/authors?email=alejandru@thebridgeschool.es
router.get("/", getAuthorsValidation, authorsController.getAuthors);
// POST   /api/authors?API_KEY=...     body: { name, surname, email, image }
router.post("/", checkApiKey, createAuthorValidation, authorsController.createAuthor);
// PUT    /api/authors?API_KEY=...     body: { email, new_email?, name, surname, image }
router.put("/", checkApiKey, updateAuthorValidation, authorsController.updateAuthor);
// DELETE /api/authors?API_KEY=...     body: { email }
router.delete("/", checkApiKey, deleteAuthorValidation, authorsController.deleteAuthor);

module.exports = router;

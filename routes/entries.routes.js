const router = require("express").Router();
const entriesController = require("../controllers/entries.controller");
const checkApiKey = require("../middlewares/checkApiKey");
const {
  getEntriesValidation,
  createEntryValidation,
  updateEntryValidation,
  deleteEntryValidation,
} = require("../validations/entries.validation");

// Orden: ruta → API_KEY → validaciones → controller
// Leer es libre; crear, modificar y borrar necesitan ?API_KEY=...

// GET    /api/entries
// GET    /api/entries?email=alejandru@thebridgeschool.es
router.get("/", getEntriesValidation, entriesController.getEntries);
// POST   /api/entries?API_KEY=...     body: { title, content, email, category }
router.post("/", checkApiKey, createEntryValidation, entriesController.createEntry);
// PUT    /api/entries?API_KEY=...     body: { title, new_title?, content, email, category }
router.put("/", checkApiKey, updateEntryValidation, entriesController.updateEntry);
// DELETE /api/entries?API_KEY=...     body: { title }
router.delete("/", checkApiKey, deleteEntryValidation, entriesController.deleteEntry);

module.exports = router;

/**
 * VALIDATIONS · entries (express-validator)
 *
 * Quién lo usa: routes/entries.routes.js, entre checkApiKey y el controller.
 * Cada regla (body("title")...) apunta los errores en req; validateResult los revisa
 * al final y responde 400 si hay alguno. Si no, pasa al controller.
 */
const { body, query } = require("express-validator");
const validateResult = require("./validateResult");

// Reglas reutilizables (los límites salen de la tabla entries en queries.sql)
const titleRule = body("title")
  .exists({ checkFalsy: true }).withMessage("El title es obligatorio").bail()
  .isString().withMessage("El title debe ser texto")
  .isLength({ max: 100 }).withMessage("El title no puede pasar de 100 caracteres");

const contentRule = body("content")
  .exists({ checkFalsy: true }).withMessage("El content es obligatorio").bail()
  .isString().withMessage("El content debe ser texto")
  .isLength({ min: 10 }).withMessage("El content debe tener al menos 10 caracteres");

const emailRule = body("email")
  .exists({ checkFalsy: true }).withMessage("El email del autor es obligatorio").bail()
  .isEmail().withMessage("El email no es válido");

const categoryRule = body("category")
  .exists({ checkFalsy: true }).withMessage("La category es obligatoria").bail()
  .isString().withMessage("La category debe ser texto")
  .isLength({ max: 15 }).withMessage("La category no puede pasar de 15 caracteres");

// GET /api/entries?email=...  → el email es opcional, pero si llega debe ser válido
const getEntriesValidation = [
  query("email").optional().isEmail().withMessage("El email no es válido"),
  validateResult,
];

// POST /api/entries
const createEntryValidation = [
  titleRule,
  contentRule,
  emailRule,
  categoryRule,
  validateResult,
];

// PUT /api/entries  → igual que POST + new_title opcional
const updateEntryValidation = [
  titleRule,
  body("new_title")
    .optional()
    .isString().withMessage("El new_title debe ser texto")
    .isLength({ min: 1, max: 100 }).withMessage("El new_title debe tener entre 1 y 100 caracteres"),
  contentRule,
  emailRule,
  categoryRule,
  validateResult,
];

// DELETE /api/entries
const deleteEntryValidation = [
  titleRule,
  validateResult,
];

module.exports = {
  getEntriesValidation,
  createEntryValidation,
  updateEntryValidation,
  deleteEntryValidation,
};

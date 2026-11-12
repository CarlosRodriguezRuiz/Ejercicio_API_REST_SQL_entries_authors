/**
 * VALIDATIONS · authors (express-validator)
 *
 * Quién lo usa: routes/authors.routes.js, entre checkApiKey y el controller.
 * Cada regla (body("email")...) apunta los errores en req; validateResult los revisa
 * al final y responde 400 si hay alguno. Si no, pasa al controller.
 */
const { body, query } = require("express-validator");
const validateResult = require("./validateResult");

// Reglas reutilizables (los límites salen de la tabla authors en queries.sql)
const nameRule = body("name")
  .exists({ checkFalsy: true }).withMessage("El name es obligatorio").bail()
  .isString().withMessage("El name debe ser texto")
  .isLength({ max: 45 }).withMessage("El name no puede pasar de 45 caracteres");

const surnameRule = body("surname")
  .exists({ checkFalsy: true }).withMessage("El surname es obligatorio").bail()
  .isString().withMessage("El surname debe ser texto")
  .isLength({ max: 45 }).withMessage("El surname no puede pasar de 45 caracteres");

const emailRule = body("email")
  .exists({ checkFalsy: true }).withMessage("El email es obligatorio").bail()
  .isEmail().withMessage("El email no es válido")
  .isLength({ max: 100 }).withMessage("El email no puede pasar de 100 caracteres");

const imageRule = body("image")
  .optional()
  .isURL().withMessage("La image debe ser una URL válida")
  .isLength({ max: 255 }).withMessage("La image no puede pasar de 255 caracteres");

// GET /api/authors?email=...  → opcional, pero si llega debe ser válido
const getAuthorsValidation = [
  query("email").optional().isEmail().withMessage("El email no es válido"),
  validateResult,
];

// POST /api/authors
const createAuthorValidation = [nameRule, surnameRule, emailRule, imageRule, validateResult];

// PUT /api/authors  → igual que POST + new_email opcional para cambiar el email
const updateAuthorValidation = [
  nameRule,
  surnameRule,
  emailRule,
  body("new_email")
    .optional()
    .isEmail().withMessage("El new_email no es válido")
    .isLength({ max: 100 }).withMessage("El new_email no puede pasar de 100 caracteres"),
  imageRule,
  validateResult,
];

// DELETE /api/authors
const deleteAuthorValidation = [emailRule, validateResult];

module.exports = {
  getAuthorsValidation,
  createAuthorValidation,
  updateAuthorValidation,
  deleteAuthorValidation,
};

// Middleware que se pone al FINAL de cada array de validaciones.
// Si alguna validación ha fallado → responde 400 con la lista de errores.
// Si todo está bien → next() y pasa al controller.
// (En el ejemplo de clase esto se hace dentro del controller; aquí lo
//  sacamos a un middleware para no repetirlo en cada función.)
const { validationResult } = require("express-validator");

const validateResult = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array(),
    });
  }
  next();
};

module.exports = validateResult;

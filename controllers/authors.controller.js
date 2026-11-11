// CONTROLLER de authors
const author = require("../models/authors.model");

// GET /api/authors                                     → todos
// GET /api/authors?email=alejandru@thebridgeschool.es  → uno
const getAuthors = async (req, res) => {
  try {
    const { email } = req.query;

    if (email) {
      const found = await author.getAuthorByEmail(email);
      if (!found) {
        return res.status(404).json({ message: `No existe el autor ${email}` });
      }
      return res.status(200).json(found);
    }

    const authors = await author.getAllAuthors();
    res.status(200).json(authors);
  } catch (error) {
    res.status(500).json({ message: "Error en la BBDD", error: error.message });
  }
};

// POST /api/authors
// Body: { name, surname, email, image }
// (los datos ya vienen validados por validations/authors.validation.js)
const createAuthor = async (req, res) => {
  const { email } = req.body;
  try {
    // Solo se crea si no hay ya un author con ese email
    const exists = await author.getAuthorByEmail(email);
    if (exists) {
      return res.status(409).json({ message: `Ya existe un usuario con el email ${email}` });
    }
    await author.createAuthor(req.body);
    res.status(201).json({ message: `usuario creado: ${email}` });
  } catch (error) {
    // 23505 = el email ya existe (es UNIQUE)
    if (error.code === "23505") {
      return res.status(409).json({ message: `Ya existe un usuario con el email ${email}` });
    }
    res.status(500).json({ message: "Error en la BBDD", error: error.message });
  }
};

// PUT /api/authors
// Body: { email, new_email (opcional), name, surname, image }  → se busca por email
const updateAuthor = async (req, res) => {
  const { email, new_email } = req.body;
  try {
    const updated = await author.updateAuthor(req.body);
    if (updated === 0) {
      return res.status(404).json({ message: `No existe el usuario ${email}` });
    }
    res.status(200).json({ message: `usuario actualizado: ${new_email || email}` });
  } catch (error) {
    // 23505 = el new_email ya lo tiene otro author
    if (error.code === "23505") {
      return res.status(409).json({ message: `Ya existe un usuario con el email ${new_email}` });
    }
    res.status(500).json({ message: "Error en la BBDD", error: error.message });
  }
};

// DELETE /api/authors
// Body: { email }  → borra el author y todas sus entries
const deleteAuthor = async (req, res) => {
  const { email } = req.body;
  try {
    const deleted = await author.deleteAuthor(email);
    if (deleted === 0) {
      return res.status(404).json({ message: `No existe el usuario ${email}` });
    }
    res.status(200).json({ message: `Se ha borrado ${email} y sus entries` });
  } catch (error) {
    res.status(500).json({ message: "Error en la BBDD", error: error.message });
  }
};

module.exports = {
  getAuthors,
  createAuthor,
  updateAuthor,
  deleteAuthor,
};

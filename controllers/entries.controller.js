// CONTROLLER de entries: lee req, valida, llama al model y responde
const entry = require("../models/entries.model");
const author = require("../models/authors.model");

// GET /api/entries                                  → todas
// GET /api/entries?email=alejandru@thebridgeschool.es → las de ese autor
const getEntries = async (req, res) => {
  try {
    const { email } = req.query;
    const entries = email
      ? await entry.getEntriesByEmail(email)
      : await entry.getAllEntries();
    res.status(200).json(entries);
  } catch (error) {
    res.status(500).json({ message: "Error en la BBDD", error: error.message });
  }
};

// POST /api/entries
// Body: { title, content, email, category }
// (los datos ya vienen validados por validations/entries.validation.js)
const createEntry = async (req, res) => {
  const { title, email } = req.body;
  try {
    // Sin esto, si el email no existe la entry se guardaría sin autor (id_author NULL)
    if (!(await author.getAuthorByEmail(email))) {
      return res.status(404).json({ message: `No existe el autor ${email}` });
    }
    await entry.createEntry(req.body);
    res.status(201).json({ message: `Se ha creado la entry '${title}'` });
  } catch (error) {
    // 23505 = violación de UNIQUE (el título ya existe)
    if (error.code === "23505") {
      return res.status(409).json({ message: `Ya existe una entry con el título '${title}'` });
    }
    res.status(500).json({ message: "Error en la BBDD", error: error.message });
  }
};

// PUT /api/entries
// Body: { title, new_title (opcional), content, email, category }
// Se busca por "title" y se reemplaza la entry entera
const updateEntry = async (req, res) => {
  const { title, email } = req.body;
  try {
    if (!(await author.getAuthorByEmail(email))) {
      return res.status(404).json({ message: `No existe el autor ${email}` });
    }
    const updated = await entry.updateEntry(req.body);
    if (updated === 0) {
      return res.status(404).json({ message: `No existe la entry '${title}'` });
    }
    res.status(200).json({ message: `Se ha modificado la entry '${title}'` });
  } catch (error) {
    if (error.code === "23505") {
      return res.status(409).json({ message: `Ya existe una entry con el título '${req.body.new_title}'` });
    }
    res.status(500).json({ message: "Error en la BBDD", error: error.message });
  }
};

// DELETE /api/entries
// Body: { title }
const deleteEntry = async (req, res) => {
  const { title } = req.body;
  try {
    const deleted = await entry.deleteEntry(title);
    if (deleted === 0) {
      return res.status(404).json({ message: `No existe la entry '${title}'` });
    }
    res.status(200).json({ message: `Se ha borrado la entry '${title}'` });
  } catch (error) {
    res.status(500).json({ message: "Error en la BBDD", error: error.message });
  }
};

module.exports = {
  getEntries,
  createEntry,
  updateEntry,
  deleteEntry,
};

// MODEL de entries: la única capa que habla con la BBDD.
// pool.query() abre la conexión, lanza el SQL y la libera solo.
const pool = require("../config/db_pgsql");
const queries = require("../queries/entries.queries");

// [] con todas las entries
const getAllEntries = async () => {
  const result = await pool.query(queries.getAllEntries);
  return result.rows;
};

// [] con las entries de un autor
const getEntriesByEmail = async (email) => {
  const result = await pool.query(queries.getEntriesByEmail, [email]);
  return result.rows;
};

// Devuelve el nº de filas insertadas (1 si ha ido bien)
const createEntry = async ({ title, content, email, category }) => {
  const result = await pool.query(queries.createEntry, [title, content, email, category]);
  return result.rowCount;
};

// Devuelve el nº de filas modificadas (0 si no existe ese título)
const updateEntry = async ({ title, new_title, content, email, category }) => {
  const result = await pool.query(queries.updateEntry, [
    new_title || title, // si no llega new_title, se queda el mismo
    content,
    email,
    category,
    title,
  ]);
  return result.rowCount;
};

// Devuelve el nº de filas borradas (0 si no existe ese título)
const deleteEntry = async (title) => {
  const result = await pool.query(queries.deleteEntry, [title]);
  return result.rowCount;
};

module.exports = {
  getAllEntries,
  getEntriesByEmail,
  createEntry,
  updateEntry,
  deleteEntry,
};

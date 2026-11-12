/**
 * MODEL · authors: la capa que habla con la BBDD
 *
 * Quién lo llama: controllers/authors.controller.js (y entries.controller para comprobar autores)
 * A quién llama:  pool (config/db_pgsql.js) con el SQL de queries/authors.queries.js
 * Devuelve datos (filas o nº de filas afectadas), nunca responde al cliente.
 */
const pool = require("../config/db_pgsql");
const queries = require("../queries/authors.queries");

// [] con todos los autores
const getAllAuthors = async () => {
  const result = await pool.query(queries.getAllAuthors);
  return result.rows;
};

// {} con el autor, o undefined si no existe
const getAuthorByEmail = async (email) => {
  const result = await pool.query(queries.getAuthorByEmail, [email]);
  return result.rows[0];
};

// Nº de filas insertadas
const createAuthor = async ({ name, surname, email, image }) => {
  const result = await pool.query(queries.createAuthor, [name, surname, email, image]);
  return result.rowCount;
};

// Nº de filas modificadas (0 si no existe ese email)
// new_email es opcional: si llega, el author cambia su email
const updateAuthor = async ({ name, surname, email, image, new_email }) => {
  const result = await pool.query(queries.updateAuthor, [
    name,
    surname,
    image,
    email,
    new_email || null,
  ]);
  return result.rowCount;
};

// Nº de filas borradas (0 si no existe ese email)
// Borrado en cascada: primero sus entries y luego el author.
// Va en una transacción: o se borra todo o no se borra nada.
const deleteAuthor = async (email) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    await client.query(queries.deleteEntriesOfAuthor, [email]);
    const result = await client.query(queries.deleteAuthor, [email]);
    await client.query("COMMIT");
    return result.rowCount;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};

module.exports = {
  getAllAuthors,
  getAuthorByEmail,
  createAuthor,
  updateAuthor,
  deleteAuthor,
};

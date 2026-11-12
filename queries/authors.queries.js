/**
 * QUERIES · SQL de la tabla authors
 *
 * Solo texto SQL, no ejecuta nada. Lo importa models/authors.model.js.
 * Los valores van con $1, $2... y se pasan aparte: así se evita la inyección SQL.
 */
const queries = {
  // Crear / borrar la tabla
  createAuthorsTable: `
    CREATE TABLE IF NOT EXISTS authors (
      id_author serial NOT NULL PRIMARY KEY,
      name varchar(45) NOT NULL,
      surname varchar(45) NOT NULL,
      email varchar(100) NOT NULL UNIQUE,
      image varchar(255)
    )`,

  // CASCADE: borra también lo que dependa de ella (la FK de entries)
  dropAuthorsTable: `
    DROP TABLE IF EXISTS authors CASCADE`,

  getAllAuthors: `
    SELECT * FROM authors
    ORDER BY id_author`,

  getAuthorByEmail: `
    SELECT * FROM authors
    WHERE email = $1`,

  createAuthor: `
    INSERT INTO authors (name, surname, email, image)
    VALUES ($1, $2, $3, $4)`,

  // $5 = new_email. Si llega NULL, COALESCE deja el email que tenía
  updateAuthor: `
    UPDATE authors
    SET name = $1, surname = $2, image = $3, email = COALESCE($5, email)
    WHERE email = $4`,

  // Antes de borrar un author borramos sus entries (borrado en cascada)
  deleteEntriesOfAuthor: `
    DELETE FROM entries
    WHERE id_author = (SELECT id_author FROM authors WHERE email = $1)`,

  deleteAuthor: `
    DELETE FROM authors
    WHERE email = $1`,
};

module.exports = queries;

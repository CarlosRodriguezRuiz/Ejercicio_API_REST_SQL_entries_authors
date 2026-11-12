/**
 * SCRIPT · initDb: prepara la BBDD
 *
 * Quién lo usa: app.js al arrancar, y `npm run init-db` a mano.
 * A quién llama: pool (config/db_pgsql.js) con el SQL de queries/*.queries.js
 */
// Crea las tablas y mete los datos de ejemplo en la BBDD del .env
// Uso: npm run init-db
// Sirve para preparar la BBDD de Render la primera vez (o la local).
// Si las tablas ya tienen datos, no inserta nada.
const pool = require("../config/db_pgsql");
const authorsQueries = require("../queries/authors.queries");
const entriesQueries = require("../queries/entries.queries");

const authors = [
  ["Alejandru", "Regex", "alejandru@thebridgeschool.es", "https://randomuser.me/api/portraits/thumb/men/75.jpg"],
  ["Birja", "Rivera", "birja@thebridgeschool.es", "https://randomuser.me/api/portraits/thumb/men/60.jpg"],
  ["Alvaru", "Riveru", "alvaru@thebridgeschool.es", "https://randomuser.me/api/portraits/thumb/men/45.jpg"],
  ["Muchelle", "Wuallus", "muchelle@thebridgeschool.es", "https://randomuser.me/api/portraits/thumb/women/72.jpg"],
  ["Albertu", "Henriques", "albertu@thebridgeschool.es", "https://randomuser.me/api/portraits/thumb/men/33.jpg"],
  ["Guillermu", "Develaweyer", "guillermu@thebridgeschool.es", "https://randomuser.me/api/portraits/thumb/men/34.jpg"],
  ["Jabier", "Hespinoza", "jabier@thebridgeschool.es", "https://randomuser.me/api/portraits/thumb/men/35.jpg"],
];

// [title, content, email del autor, category]
const entries = [
  ["Noticia: SOL en Madrid", "Contenido noticia 1", "alejandru@thebridgeschool.es", "Tiempo"],
  ["Noticia: Un panda suelto por la ciudad", "El panda se comió todas las frutas de una tienda", "birja@thebridgeschool.es", "Sucesos"],
  ["El rayo gana la champions", "Victoria por goleada en la final de la champions", "albertu@thebridgeschool.es", "Deportes"],
  ["Amanece Madrid lleno de arena", "La calima satura Madrid de arena. Pérdidas millonarias", "birja@thebridgeschool.es", "Sucesos"],
  ["Descubren el motor de agua", "Fin de la gasolina. A partir de ahora usaremos agua en nuestros coches", "alvaru@thebridgeschool.es", "Ciencia"],
];

// Crea las tablas si no existen y mete los datos si están vacías.
// La usa app.js al arrancar (así en Render se prepara sola) y "npm run init-db".
const initDb = async () => {
  await pool.query(authorsQueries.createAuthorsTable);
  await pool.query(entriesQueries.createEntriesTable);
  console.log("Tablas authors y entries listas");

  const { rows } = await pool.query("SELECT COUNT(*) FROM authors");
  if (Number(rows[0].count) > 0) {
    console.log("Ya hay datos, no inserto nada");
    return;
  }

  for (const author of authors) {
    await pool.query(authorsQueries.createAuthor, author);
  }
  for (const entry of entries) {
    await pool.query(entriesQueries.createEntry, entry);
  }
  console.log(`Insertados ${authors.length} authors y ${entries.length} entries`);
};

// Si se ejecuta directamente (npm run init-db): prepara la BBDD y cierra la conexión
if (require.main === module) {
  initDb()
    .catch((error) => {
      console.error("Error preparando la BBDD:", error.message);
      process.exitCode = 1;
    })
    .finally(() => pool.end());
}

module.exports = initDb;

require("dotenv").config();

const express = require("express");
const helmet = require("helmet");
const app = express();
const port = process.env.PORT || 3000;

// Middlewares
const error404 = require("./middlewares/error404");
const morgan = require("./middlewares/morgan");

// Rutas
const entriesRoutes = require("./routes/entries.routes");
const authorsRoutes = require("./routes/authors.routes");

// Helmet: añade cabeceras HTTP de seguridad a todas las respuestas
app.use(helmet());

// Middleware para leer el body en JSON
app.use(express.json());

// Morgan: pinta en consola cada petición
// [:date[iso]] fecha | :method verbo | :clean-url ruta sin API_KEY | :status código | :body datos enviados
app.use(morgan("[:date[iso]] :method :clean-url :status - :body"));

app.get("/", (req, res) => {
  res.send("API de entries y authors. Prueba /api/entries y /api/authors");
});

// http://localhost:3000/api/entries
app.use("/api/entries", entriesRoutes);
// http://localhost:3000/api/authors
app.use("/api/authors", authorsRoutes);

// Cualquier otra ruta → 404
app.use(error404);

// Con jest (NODE_ENV=test) no arrancamos el servidor: los tests usan "app" directamente
if (process.env.NODE_ENV !== "test") {
  // Al arrancar, prepara la BBDD (crea tablas y datos si no existen).
  // Si falla, el servidor arranca igual y se ve el error en consola.
  const initDb = require("./scripts/initDb");
  initDb().catch((error) => console.error("Error preparando la BBDD:", error.message));

  app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
  });
}

module.exports = app;

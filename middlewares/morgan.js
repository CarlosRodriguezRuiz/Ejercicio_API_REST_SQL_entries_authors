// Morgan: registra en consola las peticiones HTTP que llegan al servidor
const morgan = require("morgan");

// Un "token" es una variable propia que luego usamos en el formato (ej. :body)

// :host → nombre del servidor (ej. 'localhost')
morgan.token("host", (req, res) => req.hostname);

// :body → datos enviados en el body. Si no hay body (GET) no pinta nada
morgan.token("body", (req, res) => {
  if (!req.body || Object.keys(req.body).length === 0) {
    return "";
  }
  return JSON.stringify(req.body);
});

// :param → un parámetro de la ruta (ej. /usuarios/:id)
morgan.token("param", (req, res, param) => req.params[param]);

// :clean-url → la URL pero ocultando la API_KEY (/api/entries?API_KEY=***)
morgan.token("clean-url", (req, res) =>
  req.originalUrl.replace(/(api_key|apikey)=[^&]*/gi, "$1=***")
);

module.exports = morgan;

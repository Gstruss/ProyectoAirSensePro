const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const path = require('path');
const app = express();

app.use(bodyParser.json());
app.use(express.static('public'));
app.use(express.static('files'));
app.use(express.static(path.join(__dirname, 'public/images')));
app.use('/static', express.static(__dirname + '/public'));

let conexion = mysql.createConnection({
    host: "localhost",
    database: "airsensepro",
    user: "root",
    password: ""
});

conexion.connect((err) => {
    if (err) {
        console.error('Error de conexión: ' + err.stack);
        return;
    }
    console.log('Conectado a la base de datos como id ' + conexion.threadId);
});

app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get("/inicio", function(req, res) {
    res.render("inicio"); // Mostrar inicio.ejs al iniciar el servidor
});

app.get("/registro", function(req, res) {
    res.render("registro"); // Mostrar registro.ejs cuando se accede a /registro
});

app.get('/about', function(req, res) {
    res.render('about'); // Mostrar about.ejs cuando se accede a /about
});

app.get('/mapa', function(req, res) {
    res.render('mapa'); // Mostrar mapa.ejs cuando se accede a /mapa
});

app.get('/documents', function(req, res) {
    res.render('documents'); // Mostrar documents.ejs cuando se accede a /documents
});

app.get('/info', function(req, res) {
  res.render('info'); // Mostrar Info.ejs cuando se accede a /info
});

// Ruta para manejar el registro
app.post('/validar', (req, res) => {
    const { nom, correo, pass } = req.body;

    const query = 'CALL registrar_usuario(?, ?, ?)';
    conexion.query(query, [nom, correo, pass], (error, results) => {
        if (error) {
            console.error('Error en la consulta: ', error); // Mejor manejo de errores
            return res.status(500).json({ mensaje: 'Error en el servidor.' });
        }
        res.json(results[0][0]); // Retornar el mensaje del procedimiento
    });
});

// Ruta para manejar el ingreso de usuario
app.post('/login', (req, res) => {
  const { correo, clave } = req.body;

  const query = 'CALL iniciar_sesion(?, ?)';
  conexion.query(query, [correo, clave], (error, results) => {
      if (error) {
          console.error('Error en la consulta: ', error);
          return res.status(500).json({ mensaje: 'Error en el servidor.' });
      }

      // Verificar si hay resultados y responder
      if (results[0] && results[0][0]) {
          const mensaje = results[0][0].mensaje; // Asegúrate de que el mensaje se devuelve correctamente
          res.json({ mensaje });
      } else {
          res.json({ mensaje: 'Error: Credenciales incorrectas o usuario no registrado.' });
      }
  });
});


app.listen(3001, () => {
    console.log("Servidor creado http://localhost:3001/inicio");
});

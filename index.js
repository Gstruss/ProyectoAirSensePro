const express = require('express');
const mysql = require('mysql');
const path = require('path');
const app = express();

app.use(express.static('public'));
app.use(express.static('files'));
app.use(express.static(path.join(__dirname, 'public/images')));
app.use('/static', express.static(__dirname + '/public'));

let conexion = mysql.createConnection({
    host: "localhost",
    database: "airsensepro",
    user: "root",
    password: ""
})

app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({extended:false}));

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

app.post("/validar", function(req, res) {
    const datos = req.body;
  
    let nombre = datos.nom;
    let correo = datos.correo;
    let clave = datos.pass;
  
    let registrar = "CALL sp_registrar_usuario('" + nombre + "', '" + correo + "', '" + clave + "');";
  
    conexion.query(registrar, function(error) {
      if (error) {
        throw error;
      } else {
        console.log("Datos almacenados correctamente");
        res.redirect("/inicio");
      }
    });
  });

  app.post("/login", function(req, res) {
    const datos = req.body;
  
    let correo = datos.correo;
    let clave = datos.pass;
  
    let consultar = "CALL sp_verificar_usuario('" + correo + "', '" + clave + "');";
  
    conexion.query(consultar, function(error, results) {
      if (error) {
        throw error;
      } else {
        if (results.length > 0) {
          // User found, log them in
          console.log("Usuario encontrado, inicio de sesión correcto");
          res.redirect("/mapa");
        } else {
          // User not found, display error message
          console.log("Usuario no encontrado, inicio de sesión incorrecto");
          res.redirect("/inicio"); // or display an error message
        }
      }
    });
  });

app.listen(3000, function() {
    console.log("Servidor creado http://localhost:3000/inicio");
});
import Express from 'express';
//Fix para _dirname
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
//-----------------


//Server
const app = Express();
const PORT = 3000;

app.use(Express.static(path.join(__dirname, 'public')));

//Iniciar servidor  
app.listen(PORT, () => {
  console.log("Servidor corriendo en puerto", PORT);
});

//Configuración de la App
app.use(Express.static(__dirname + '/public'));

// Ruta para la página principal
app.get('/', (req, res) => {
    res.redirect('/login');
});

//Rutas
app.get("/login", (req, res) => {
  res.sendFile("pages/login.html", { root: __dirname });
});
app.get("/register", (req, res) => {
  res.sendFile("pages/register.html", { root: __dirname });
});

app.get("/home", (req, res) => {
  res.sendFile("pages/home.html", { root: __dirname });
});
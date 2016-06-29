const http = require('http')
const path = require('path')
const express = require('express')
const cookieParse = require('cookie-parser') /* parsear cookies*/
const bodyParser = require('body-parser') /* parsear body de http request*/
const expressSession = require('express-session') /* maneja las sesiones para persistir a users registrado*/
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const port = process.env.PORT || 8080

const app = express()
const server = http.createServer(app)

/* configurando middlewares*/
app.use(bodyParser.json()) /* parsear bodys que puedan llegar en json*/
app.use(bodyParser.urlencoded({ extended: false })) /* parsear bodys que puedan llegar encodeados en la url como forms*/
app.use(cookieParse()) /* parsear cookies que llegan a la app*/
app.use(expressSession({
  secret: 'my secret are mine', /* sessiones trabajan con una llave secreta para encriptar la sesion*/
  resave: false,
  saveUninitialized: false
}))

/* configurando middlewares de passport*/
app.use(passport.initialize()) /*decirle a express que trabaje con passport*/
app.use(passport.session()) /* utilizar sesiones que tiene passport*/

app.use(express.static(path.join(__dirname, 'public')))

/* configuracion de la estrategia de passport-local*/

/* passport utiliza el mismo patron de express y por ende le configurmaos middlewares*/
/* le decimos que vamos a trabajar con LocalStrategy que es una clase y creamos una nueva instancia
   LocalStrategy recibe un callback por parametro con username, password y un callback que define si
   la autenticacion ya fue lista o no, entonces cada vez que hago la peticion el va a ejecutar este codigo
   de LocalStrategy y aca es donde debo verificar si usuario y contraseña son validos o no
*/
passport.use(new LocalStrategy((username, password, done) => {
  // Aqui ira la logica de la db, comparacion de user y password recibido con la db
  if (username === 'soy' && password === 'platzi') {
    return done(null, { namr: 'Super', lastname: 'User', username: 'superuser' }) /* retornando callback con objeto que viene de la db con las propiedades que queramos*/
  }

  done(null, false, { message: 'Unknown user'})
}))

server.listen(port, () => console.log(`Listening on port ${port}`))

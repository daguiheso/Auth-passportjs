const http = require('http')
const path = require('path')
const express = require('express')
const cookieParser = require('cookie-parser') /* parsear cookies*/
const bodyParser = require('body-parser') /* parsear body de http request*/
const expressSession = require('express-session') /* maneja las sesiones para persistir a users registrado*/
const passport = require('passport')
const TwitterStrategy = require('passport-twitter').Strategy
const port = process.env.PORT || 8080

const app = express()
const server = http.createServer(app)

/* configurando middlewares*/
app.use(bodyParser.json()) /* parsear bodys que puedan llegar en json*/
app.use(bodyParser.urlencoded({ extended: false })) /* parsear bodys que puedan llegar encodeados en la url como forms*/
app.use(cookieParser()) /* parsear cookies que llegan a la app*/
app.use(expressSession({
  secret: 'my secret are mine', /* sessiones trabajan con una llave secreta para encriptar la sesion*/
  resave: false,
  saveUninitialized: false
}))

/* configurando middlewares de passport*/
app.use(passport.initialize()) /*decirle a express que trabaje con passport*/
app.use(passport.session()) /* utilizar sesiones que tiene passport*/

app.use(express.static(path.join(__dirname, 'public')))

/* De esta manera podemos obtener el objeto de twitter y hacer mapeo con db por twitter-username y obtenerlo de la db*/
passport.serializeUser((user, done) => done(null, user))
passport.deserializeUser((user, done) => done(null, user))

app.get('/logout', (req, res) => {
  /* Lo otro que tiene passportjs es que en dentro del objeto req en el middleware el agrega una function logout()*/
  req.logout() /* se encarga de limpiar la sesion*/
  res.redirect('/')
})

app.get('/welcome', ensureAuth, (req, res) => {
  /* otra de passportjs es que el usuario autenticado lo va aguardar siempre en la propiedad user del request, este user lo obtiene de lo deserializado*/
  res.send(`You are welcome ${req.user.displayname}`)
})

function ensureAuth (req, res, next) {
  /* utilizamos metodo isAuthenticated() de passport en req*/
  if (req.isAuthenticated()) {
    return next()
  }

  res.redirect('/')
}

server.listen(port, () => console.log(`Listening on port ${port}`))

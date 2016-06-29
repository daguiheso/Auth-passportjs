const http = require('http')
const path = require('path')
const express = require('express')
const cookieParse = require('cookie-parser') /* parsear cookies*/
const bodyParser = require('body-parser') /* parsear body de http request*/
const expressSession = require('express-session') /* maneja las sesiones para persistir a users registrado*/
const port = process.env.PORT || 8080

const app = express()
const server = http.createServer(app)

/* configurando middlewares*/
app.use(bodyParser.json()) /* parsear bodys que puedan llegar en json*/
app.use(bodyParser.urlencoded({ extended: false })) /* parsear bodys que puedan llegar encodeados en la url como forms*/
app.use(cookieParse()) /* parsear cookies que llegan a la app*/
app.use(expressSession({
	secret: 'my secret are mine' /* sessiones trabajan con una llave secreta para encriptar la sesion*/
	resave: false,
	saveUninitialized: false
}))
app.use(express.static(path.join(__dirname, 'public')))

server.listen(port, () => console.log(`Listening on port ${port}`))
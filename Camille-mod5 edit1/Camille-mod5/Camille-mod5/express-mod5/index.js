const express = require('express')
const exphbs = require('express-handlebars')
const session = require('express-session')
const FileStore = require('session-file-store')(session)
const flash = require('express-flash')

//Atribui express na variável app
const app = express()

//Atribuir banco de dados 
const conn = require('./db/conn')

//Models
const Tought = require('./models/Task')
const User = require('./models/Usuario')

// Routes
const taskRoutes = require('./routes/taskRoutes')
const autenticaRoutes = require('./routes/autenticaRoutes')

//Controller
const TaskController = require('./controllers/TaskController')

//template engine
app.engine('handlebars', exphbs.engine())
app.set('view engine', 'handlebars')

//receber respostas do body
app.use(express.urlencoded({
    extended: true,
}))

app.use(express.json())

//session middleware
app.use(
    session({
        name: "session",
        secret: "mySecret8160",
        resave: false,
        saveUninitialized: false,
        store: new FileStore({
            logFn: function () { },
            path: require('path').join(require('os').tmpdir(), 'sessions'),
        }),
        cookie: {
            secure: false,
            maxAge: 360000,
            expires: new Date(Date.now() + 360000),
            httpOnly: true
        }
    }),
)

// flash messages 
app.use(flash())

//public path utilizaçãod a pasta public
app.use(express.static('public'))

// set session to res
app.use((req, res, next) => {
    if (req.session.userId) {
        res.locals.session = req.session
    }
    next()
})


//Routes
app.use('/task', taskRoutes) // Conectar o arquivo handlebars nas rotas
app.use('/', autenticaRoutes)

app.get('/', TaskController.showTask)

// Conecção ao banco de dados
conn
    // .sync({force: true})
    .sync()
    .then(() => {
        app.listen(3000)
    })
    .catch((err) => console.log(err))
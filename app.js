const path = require('path');

const express = require('express');
const hbs = require('hbs');
const mongoose = require('mongoose');
const session = require('express-session');

const config = require('./src/config');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const bootstrapRoute = path.join(__dirname, '/node_modules');
app.use(express.static(path.join(__dirname, 'public')));
app.use('/css', express.static(bootstrapRoute + '/bootstrap/dist/css'));
app.use('/js', express.static(bootstrapRoute + '/jquery/dist'));
app.use('/js', express.static(bootstrapRoute + '/popper.js/dist'));
app.use('/js', express.static(bootstrapRoute + '/bootstrap/dist/js'));

app.use(
  session({
    secret: 'carthago',
    resave: false,
    saveUninitialized: true
  })
);

app.use((req, res, next) => {
  console.log(req.session.type);
  if (req.session.name) {
    if (req.session.type == 'coordinator') {
      res.locals.isCoordinator = true;
      res.locals.isCandidate = false;
    }
    if (req.session.type == 'candidate') {
      res.locals.isCoordinator = false;
      res.locals.isCandidate = true;
    }
  }
  next();
});

const dirPartials = path.join(__dirname, '/views/partials');
app.set('view engine', 'hbs');
hbs.registerPartials(dirPartials);
require('./src/helpers');

app.get('/', (req, res) => {
  res.render('index');
});

app.listen(config.PORT, () => {
  mongoose.connect(
    config.MONGODB_URI,
    { useNewUrlParser: true, useFindAndModify: false },
    err => {
      if (err) return console.error(err);
      console.log('Conectado correctamente a la base de datos');
    }
  );
});

const db = mongoose.connection;

db.on('error', err => console.error(err));

db.once('open', () => {
  const candidatesRoutes = require('./routes/candidates');
  const coursesRoutes = require('./routes/courses');
  const usersRoutes = require('./routes/users');
  app.use('/candidates', candidatesRoutes);
  app.use('/courses', coursesRoutes);
  app.use('/users', usersRoutes);
  console.log(`Servidor iniciado en el puerto${config.PORT}`);
});

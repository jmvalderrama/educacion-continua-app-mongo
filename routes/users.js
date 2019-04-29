const express = require('express');
const session = require('express-session');

const User = require('../src/models/User');

const router = express.Router();

router.use(
  session({
    secret: 'carthago',
    resave: false,
    saveUninitialized: true
  })
);

router.post('/login', (req, res) => {
  try {
    User.findOne({ username: req.body.username }, (err, response) => {
      if (err) return console.log(err);
      //console.log(response);
      // Validations
      req.session.type = response.role_type;
      req.session.name = response.fullname;
      //console.log(req.session);
      res.render('pages/information', {
        welcome: {
          fullname: req.session.name
        }
      });
    });
  } catch (error) {
    return console.log(error);
  }
});

router.get('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) return console.log(err);
  });
  res.redirect('/');
});

router.post('/dashboard', (req, res) => {
  res.render('pages/dashboard', {
    sessionStarted: {
      fullname: req.session.name
    }
  });
});

router.get('/sign', (req, res) => {
  res.render('pages/sign');
});

router.post('/sign', (req, res) => {
  const { fullname, username, password, document_id, phone, mail } = req.body;
  const user = new User({
    fullname,
    username,
    password,
    document_id,
    phone,
    mail
  });

  try {
    User.findOne({ document_id: user.document_id }, (err, response) => {
      if (err) return console.log(err);
      let style,
        msg = '';
      if (!response) {
        user.save(err => {
          if (err) return console.log(err);
        });
        style = 'success';
        msg = `El usuario "${user.fullname}" ha sido registrado con éxito`;
      } else {
        style = 'danger';
        msg = `Ya existe otro usuario con ese documento (${user.document_id})`;
      }

      res.render('pages/confirm', {
        messageInfo: {
          display: '',
          className: style,
          message: msg
        }
      });
    });
  } catch (error) {
    return console.log(error);
  }
});

module.exports = router;

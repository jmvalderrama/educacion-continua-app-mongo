const express = require('express');
const session = require('express-session');

const Candidate = require('../src/models/Candidate');
const Course = require('../src/models/Course');

const router = express.Router();

router.use(
  session({
    secret: 'carthago',
    resave: false,
    saveUninitialized: true
  })
);

router.get('/new', (req, res) => {
  try {
    Course.find({}).exec((err, response) => {
      if (err) return console.log(err);
      res.render('candidates/new', {
        displaySelect: {
          courseSelect: response
        },
        sessionStarted: {
          fullname: req.session.name
        }
      });
    });
  } catch (error) {
    return console.log(error);
  }
});

router.post('/new', (req, res) => {
  const { candidate_id, email, name, phone } = req.body;
  const candidate = new Candidate({
    candidate_id,
    email,
    name,
    phone,
    courses_ids: []
  });
  let style,
    msg = '';
  let isEnrolled;
  try {
    Candidate.findOne({ candidate_id }).exec((err, response) => {
      if (err) return console.log(err);
      if (response != null) {
        candidate.courses_ids = response.courses_ids;
      }
      if (candidate.courses_ids.length > 0) {
        candidate.courses_ids.forEach(item =>
          item == req.body.course ? (isEnrolled = true) : (isEnrolled = false)
        );
        if (!isEnrolled) {
          candidate.courses_ids.push(parseInt(req.body.course));
          msg = `El aspirante ${name} ha sido inscrito al curso exitosamente`;
          style = 'success';
        } else {
          msg = `El aspirante ${name} ya se encuentra inscrito en el curso`;
          style = 'danger';
          res.render('pages/confirm', {
            messageInfo: {
              display: '',
              className: style,
              message: msg
            },
            sessionStarted: {
              fullname: req.session.name
            }
          });
          return;
        }
      } else {
        candidate.courses_ids.push(parseInt(req.body.course));
        msg = `El aspirante ${name} ha sido inscrito al curso exitosamente`;
        style = 'success';
      }

      if (response != null) {
        if (response.candidate_id == candidate_id) {
          Candidate.findOneAndUpdate(
            { candidate_id: candidate.candidate_id },
            { courses_ids: candidate.courses_ids },
            { new: true },
            err => {
              if (err) return console.log(err);
            }
          );
        } else {
          candidate.save(err => {
            if (err) return console.log(err);
          });
        }
      } else {
        candidate.save(err => {
          if (err) return console.log(err);
        });
      }

      res.render('pages/confirm', {
        messageInfo: {
          display: '',
          className: style,
          message: msg
        },
        sessionStarted: {
          fullname: req.session.name
        }
      });
    });
  } catch (error) {
    return console.log(error);
  }
});

router.get('/list', (req, res) => {
  try {
    Course.find({}).exec((err, response) => {
      if (err) return console.log(err);
      res.render('candidates/list', {
        coursesList: {
          list: response
        },
        sessionStarted: {
          fullname: req.session.name
        }
      });
    });
  } catch (error) {
    return console.log(error);
  }
});

module.exports = router;

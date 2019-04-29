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
  res.render('courses/new', {
    sessionStarted: {
      fullname: req.session.name
    }
  });
});

router.post('/new', (req, res) => {
  const { course_id, name, modality, price, description, hours } = req.body;
  const course = new Course({
    course_id,
    name,
    modality,
    price,
    description,
    hours
  });

  try {
    Course.findOne({ course_id: course.course_id }).exec((err, response) => {
      if (err) return console.log(err);
      let style,
        msg = '';
      if (!response) {
        course.save(err => {
          if (err) return console.log(err);
        });
        style = 'success';
        msg = `El curso "${course.name}" ha sido agregado con éxito`;
      } else {
        style = 'danger';
        msg = `Ya existe otro curso con ese id (${course.course_id})`;
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

router.get('/table', (req, res) => {
  try {
    Course.find({}).exec((err, response) => {
      if (err) return console.log(err);
      res.render('courses/table', {
        messageInfo: {
          display: 'display: none',
          className: '',
          message: ''
        },
        table: {
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

router.get('/enrolled', (req, res) => {
  try {
    let courseName, state;
    Course.findOne({ course_id: req.query.course_id }).exec((err, course) => {
      if (err) return console.log(err);
      courseName = course.name;
      courseId = course.course_id;
      state = course.state;
      Candidate.find({ courses_ids: parseInt(req.query.course_id) }).exec(
        (err, response) => {
          if (err) return console.log(err);
          res.render('courses/candidates-enrolled', {
            listEnrolled: {
              candidates: response,
              courseName,
              courseId
            },
            courseState: {
              state
            },
            sessionStarted: {
              fullname: req.session.name
            }
          });
        }
      );
    });
  } catch (error) {
    return console.log(error);
  }
});

router.get('/search', (req, res) => {
  try {
    Course.find({}).exec((err, response) => {
      if (err) return console.log(err);
      res.render('courses/search', {
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

router.post('/delete-candidate', (req, res) => {
  try {
    Candidate.findOne(
      { candidate_id: req.body.candidate_id },
      (err, response) => {
        if (err) return console.log(err);
        let newCoursesIds = response.courses_ids.filter(
          course => course != req.body.course_id
        );
        Candidate.findOneAndUpdate(
          { candidate_id: req.body.candidate_id },
          { courses_ids: newCoursesIds },
          { new: true },
          err => {
            if (err) return console.log(err);
            res.render('pages/confirm', {
              messageInfo: {
                display: '',
                className: 'success',
                message: `El aspirante ${
                  response.name
                } ha sido borrado del curso con ID "${req.body.course_id}"`
              },
              sessionStarted: {
                fullname: req.session.name
              }
            });
          }
        );
      }
    );
  } catch (error) {
    return console.log(error);
  }
});

router.post('/close-course', (req, res) => {
  try {
    Course.findOneAndUpdate(
      { course_id: req.body.course_id },
      { state: 'closed' },
      { new: true },
      err => {
        if (err) return console.log(err);
        res.render('pages/confirm', {
          messageInfo: {
            display: '',
            className: 'success',
            message: `El curso con ID "${req.body.course_id}" ha sido cerrado`
          },
          sessionStarted: {
            fullname: req.session.name
          }
        });
      }
    );
  } catch (error) {
    return console.log(error);
  }
});

module.exports = router;

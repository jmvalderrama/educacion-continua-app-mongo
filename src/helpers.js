const hbs = require('hbs');

// Mensaje de información
hbs.registerHelper('messageInfo', options => {
  const { display, className, message } = options.data.root.messageInfo;
  return `<div style="${display}" class="alert alert-${className}" role="alert">${message}</div>`;
});

// Tabla de cursos
hbs.registerHelper('table', options => {
  const list = options.data.root.table.list;
  let coursesTable = `<table class="table table-hover">
  <thead class="bg-success">
  <th>Id</th>
  <th>Nombre</th>
  <th>Descripción</th>
  <th>Valor</th>
  <th>Modalidad</th>
  <th>Intensidad</th>
  <th>Estado</th>
  </thead>
  <tbody>`;

  list.forEach(course => {
    coursesTable =
      coursesTable +
      `<tr>
        <td>${course.course_id}</td>
        <td>${course.name}</td>
        <td>${course.description}</td>
        <td>$${course.price}</td>
        <td>${
          course.modality == '-'
            ? '-'
            : course.modality == 'virtual'
            ? 'Virtual'
            : 'Presencial'
        }</td>
        <td>${course.hours == 0 ? '-' : course.hours + ' horas'}</td>
        <td>${course.state == 'available' ? 'Disponible' : 'Cerrado'}</td>
      </tr>`;
  });

  coursesTable = coursesTable + '</tbody></table>';
  return coursesTable;
});

// Lista de cursos disponibles
hbs.registerHelper('list', options => {
  const { list } = options.data.root.coursesList;
  let coursesCollapse = `<div class="accordion" id="accordionExample">`;
  i = 0;
  list.forEach(course => {
    if (course.state == 'available') {
      coursesCollapse =
        coursesCollapse +
        `<div class="card">
      <div class="card-header" id="heading${i}">
        <h2 class="mb-0">
          <button class="btn btn-link" type="button" data-toggle="collapse" data-target="#collapse${i}" aria-expanded="true" aria-controls="collapse${i}">
            <p class="text-left"><span class="text-decoration-none"><strong>Nombre del curso: </strong>${
              course.name
            }</span><br>
            <span class="text-decoration-none"><strong>Descripción: </strong>${
              course.description
            }</span><br>
            <span class="text-decoration-none"><strong>Valor: </strong>$${
              course.price
            }</span></p>
          </button>
        </h2>
      </div>
  
      <div id="collapse${i}" class="collapse" aria-labelledby="heading${i}" data-parent="#accordionExample">
        <div class="card-body">
          <span><strong>Nombre del curso: </strong>${course.name}</span><br>
          <span><strong>Descripción: </strong>${course.description}</span><br>
          <span><strong>Valor: </strong>$${course.price}</span><br>
          <span><strong>Modalidad: </strong>${
            course.modality == '-'
              ? '-'
              : course.modality == 'virtual'
              ? 'Virtual'
              : 'Presencial'
          }</span><br>
          <span><strong>Intensidad: </strong>${
            course.hours == 0 ? '-' : course.hours + ' horas'
          }</span>
        </div>
      </div>
    </div>`;
      i++;
    }
  });

  coursesCollapse = coursesCollapse + '</div>';
  return coursesCollapse;
});

// Select para elegir un curso
hbs.registerHelper('displaySelect', options => {
  const { courseSelect } = options.data.root.displaySelect;
  let selectCourse = `<select class="form-control" id="course_id" name="course_id"><option value="-" selected></option>`;
  courseSelect.forEach(course => {
    if (course.state == 'available') {
      selectCourse =
        selectCourse +
        `<option value="${course.course_id}">${course.name}: ${
          course.description
        }</option>`;
    }
  });

  selectCourse = selectCourse + '</select>';
  return selectCourse;
});

// Estado del curso
hbs.registerHelper('courseState', options => {
  const { courseId } = options.data.root.listEnrolled;
  const courseState = options.data.root.courseState.state;
  let state = `<form action="/courses/close-course" method="POST" class="mb-4"><div class="form-row"><div class="form-group col-md-6"><strong>Estado: </strong>${
    courseState == 'available' ? 'Disponible' : 'Cerrado'
  }<input type="hidden" name="course_id" id="course_id" value="${courseId}" class="form-control"/><button type="submit" style="margin-left: 1rem;" onclick="confirm('¿Estás seguro de cerrar este curso?');" class="btn btn-warning">Cerrar</button></div></div></form><hr>`;
  return state;
});

// Lista de inscritos
hbs.registerHelper('listEnrolled', options => {
  const { candidates, courseName, courseId } = options.data.root.listEnrolled;
  if (candidates.length > 0) {
    let content = `<h3 class="mt-4">Información del curso: ${courseName}</h3><br><table class="table table-hover">
    <thead class="bg-success">
    <th>Documento</th>
    <th>Nombre</th>
    <th>Correo</th>
    <th>Teléfono</th>
    <th>Acción</th>
    </thead>
    <tbody>`;
    candidates.forEach(candidate => {
      content =
        content +
        `<tr>
      <td>${candidate.candidate_id}</td>
      <td>${candidate.name}</td>
      <td>${candidate.email}</td>
      <td>${candidate.phone}</td>
      <td><form method="POST" action="/courses/delete-candidate"><input type="hidden" name="candidate_id" id="candidate_id" value="${
        candidate.candidate_id
      }"/><input type="hidden" name="course_id" id="course_id" value="${courseId}"/><button type="submit" onclick="confirm('¿Estás seguro de eliminar este registro?');" class="btn btn-danger">Eliminar</button></form></td>
    </tr>`;
    });
    content = content + `</tbody></table>`;
    return content;
  } else {
    let content = `<h3>Información del curso: ${courseName}</h3><br><p>No hay ningún aspirante inscrito</p>`;
    return content;
  }
});

// Mensaje de bienvenida
hbs.registerHelper('welcome', options => {
  const { fullname } = options.data.root.welcome;
  let welcome = `Has iniciado sesión, ${fullname}`;
  return `<form action="/users/dashboard" method="POST" class="form-inline my-2 my-lg-0">
  <span class="h4">${welcome}</span>
  <input type="hidden" value="${welcome}" /><br>
  <button class="btn btn-success my-2 my-sm-0 ml-2" type="submit">Continuar</button>
</form>`;
});

// Información usuario con sesión iniciada
hbs.registerHelper('sessionStarted', options => {
  const { fullname } = options.data.root.sessionStarted;
  let welcome = `Bienvenido, ${fullname}`;
  return `<form action="/users/logout" method="GET" class="form-inline my-2 my-lg-0">
    <span class="h4">${welcome}</span>
    <button class="btn btn-outline-success my-2 my-sm-0 ml-2" type="submit">Salir</button>
  </form>`;
});

// Sitio personal usuario
hbs.registerHelper('personalSite', options => {
  if (options.data.root.sessionStarted == undefined) {
    return `<a class="navbar-brand" href="/">Bienvenido</a>`;
  }
  const { fullname } = options.data.root.sessionStarted;
  return `<form action="/users/dashboard" method="POST" class="form-inline my-2 my-lg-0">
  <input type="hidden" value="${fullname}" /><br>
  <button class="navbar-brand btn btn-outline-dark my-2 my-sm-0 ml-2" type="submit">Sitio personal</button>
</form>`;
});

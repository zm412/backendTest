
const { Pool } = require('pg')
const config = require('../config');
const validationTools = require('./funValidation');

let {checkDate, prepareData} = validationTools;


const pool = new Pool({
  user: config.POSTGRES_USER,
  host: 'localhost',
  database: 'mydb',
  password: config.POSTGRES_PASS,
  port: 5432,
});



const getLessons = () => {
  return new Promise(function(resolve, reject) {
    pool.query('SELECT * FROM lessons', (error, results) => {
      if (error) {
        reject(error)
        console.log('errorLM106', error)
      }
      resolve(results.rows);
    })
  }) 
}

const filteringFunc = (entryObj) => {
  console.log(entryObj, 'entryObj')

return new Promise(function(resolve, reject) {
  let body = prepareData(entryObj);
  let {date1, date2, status, teacherIds, studentsCount, page, lessonsPerPage, offset} = body;
  console.log(body, 'body')

    let sqlCommPart = `
    
CREATE TEMP TABLE temp_store ON COMMIT DROP
AS
    SELECT * FROM
    (
      select DISTINCT ON (lessons.id) lessons.id,lessons.date, lessons.title,lessons.status,
          (
          select array_agg(row_to_json(d))
          from (
              select students.id, students.name, lesson_students.visit
              from students, lesson_students
              where lesson_students.lesson_id = lessons.id AND
              lesson_students.student_id = students.id
                ) d
          ) as students,
           (
          select array_agg(row_to_json(p))
          from (
              select teachers.id, teachers.name
              from teachers, lesson_teachers
              where lesson_teachers.lesson_id = lessons.id AND
              lesson_teachers.teacher_id = teachers.id
                ) p
          ) as teachers,
            (
              select count(*)
              from lesson_students
              where lesson_students.visit = 't' AND
              lesson_students.lesson_id = lessons.id
          ) as visitCount 

          
          from lessons, lesson_teachers  
       ) AS combined;

    select * from temp_store
    limit ${lessonsPerPage}
    offset ${offset}

    `
    
    let sqlFilters = ` 
    
    CREATE TEMP TABLE temp_store ON COMMIT DROP
    AS
      SELECT * FROM
      (
      select DISTINCT ON (lessons.id) lessons.id,lessons.date, lessons.title,lessons.status,
          (
          select array_agg(row_to_json(d))
          from (
              select students.id, students.name, lesson_students.visit
              from students, lesson_students
              where lesson_students.lesson_id = lessons.id AND
              lesson_students.student_id = students.id
                ) d
          ) as students,
           (
          select array_agg(row_to_json(p))
          from (
              select teachers.id, teachers.name
              from teachers, lesson_teachers
              where lesson_teachers.lesson_id = lessons.id AND
              lesson_teachers.teacher_id = teachers.id
                ) p
          ) as teachers,
            (
              select count(*)
              from lesson_students
              where lesson_students.visit = 't' AND
              lesson_students.lesson_id = lessons.id
          ) as visitCount 
          
        from lessons, lesson_teachers  


      WHERE 
        lessons.date >= '${date1}' AND
        lessons.date <= '${date2}' AND
        lessons.status IN ( ${status} ) AND
        exists(
            select lesson_teachers.lesson_id
              from lesson_teachers
              where lessons.id = lesson_teachers.lesson_id AND
              lesson_teachers.teacher_id IN ( ${ teacherIds } )

          ) AND
         (
            select count(*)
            from lesson_students
            where
            lesson_students.lesson_id = lessons.id
        ) IN  (  ${studentsCount} ) 
       ) AS combined ;

    select * from temp_store
    limit ${lessonsPerPage}
    offset ${offset}

    `;

    let sqlFullQuery = entryObj.date === '' && entryObj.status === '' && entryObj.teacherIds === '' && entryObj.studentsCount === '' ? sqlCommPart : sqlFilters;

    pool.query(sqlFullQuery , (error, results) => {
              if (error) {
                console.log(error)
                reject(error)
              }
      console.log('RESULT INDEX',results)
      console.log('RESULT INDEX',results[1].rows)
      resolve(results[1].rows);
    })
  })
}


const createLesson = (body) => {
  return new Promise(function(resolve, reject) {
    const { name, email } = body
    pool.query('INSERT INTO lessons (name, email) VALUES ($1, $2) RETURNING *', [name, email], (error, results) => {
      if (error) {
        reject(error)
      }
      resolve(`A new merchant has been added added: ${results.rows[0]}`)
    })
  })
}

const deleteLesson = () => {
  return new Promise(function(resolve, reject) {
    const id = parseInt(request.params.id)
    pool.query('DELETE FROM lessons WHERE id = $1', [id], (error, results) => {
      if (error) {
        reject(error)
      }
      resolve(`Lesson deleted with ID: ${id}`)
    })
  })
}


module.exports = {
  getLessons,
  createLesson,
  deleteLesson,
  filteringFunc
}

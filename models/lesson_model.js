const { Pool } = require('pg')
const config = require('../config');
const Sequelize = require("sequelize");

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
//
//const filteringFunc = (body) => {
//  return new Promise(function(resolve, reject) {
//    const {status, id} = body;
//    pool.query(`SELECT * FROM lessons WHERE status=${status} AND id=${id}`,  (error, results) => {
//      if (error) {
//        console.log(error)
//        reject(error)
//      }
//      console.log('RESULT INDEX',results.rows)
//      resolve(results.rows);
//    })
//  })
//}
//
//const filteringFunc = (body) => {
//  return new Promise(function(resolve, reject) {
//    const {teacherIds} = body; 
//
//    pool.query(`SELECT * FROM lesson_teachers WHERE teacher_id IN ( ${teacherIds})`,  (error, results) => {
//      if (error) {
//        console.log(error)
//        reject(error)
//      }
//      console.log('RESULT INDEX',results.rows)
//      resolve(results.rows);
//    })
//  })
//}
//
//const filteringFunc = (body) => {
//  return new Promise(function(resolve, reject) {
//    let bodyDate = body.date.split(',');
//
//    //pool.query(`SELECT * FROM lessons WHERE date = '${body.date}'`,  (error, results) => {
//    pool.query(`SELECT * FROM lessons WHERE date >= '${bodyDate[0]}' AND date <= '${bodyDate[1]}'`,  (error, results) => {
//      if (error) {
//        console.log(error)
//        reject(error)
//      }
//      console.log('RESULT INDEX',results.rows)
//      resolve(results.rows);
//    })
//  })
//}

const filteringFunc = (body) => {
  return new Promise(function(resolve, reject) {
    let bodyDate = body.date.split(',');
    let status = body.status;
    let teacherIds = body.teacherIds;
    let studentsCount = body.studentsCount;
    console.log(bodyDate, status, teacherIds)

    pool.query(
      `
    select lessons.id,lessons.date, lessons.title,lessons.status,
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
      date >= '${bodyDate[0]}' AND
      date <= '${bodyDate[1]}' AND
      status = ${status} AND
      teacher_id IN ( ${teacherIds}) AND
      studentsCount = ${studentsCount}
      
`,

                                                      (error, results) => {
              if (error) {
                console.log(error)
                reject(error)
              }
      console.log('RESULT INDEX',results.rows)
      resolve(results.rows);
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

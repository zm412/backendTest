const { Pool } = require('pg')
const config = require('../config');

const Sequelize = require("sequelize");

const sequelize = new Sequelize("mydb", config.POSTGRES_USER, config.POSTGRES_PASS, {
  dialect: "postgres",
  host: "localhost",
  port: "5432",
   define: {
    timestamps: false
  }
});

const Lesson_students = sequelize.define("lesson_students", {
  lesson_id: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  student_id: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  visit: {
    type: Sequelize.BOOLEAN,
    defaultValue: false,
    allowNull: false
  }
});

const Lesson_teachers = sequelize.define("lesson_teachers", {
  lesson_id: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  teacher_id: {
    type: Sequelize.INTEGER,
    allowNull: false
  }
});

const Lessons = sequelize.define("lessons", {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  date: {
    type: Sequelize.DATE,
    allowNull: false,
  },
  title: {
    type: Sequelize.STRING(100),

  },
  status: {
    type: Sequelize.INTEGER,
    allowNull: false,
    defaultValue: 0,
  }
});


const Students = sequelize.define("students", {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  name: {
    type: Sequelize.STRING(10),
  }
});

const Teachers = sequelize.define("teachers", {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  name: {
    type: Sequelize.STRING(10),
  }
});

//sequelize.sync().then(result=>{
//})
//.catch(err=> console.log("ERROR!!", err));



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

//const filteringFunc = (body) => {
//    let bodyDate = body.date.split(',');
//    let status = body.status;
//    let teacherIds = body.teacherIds;
//    let studentsCount = body.studentsCount;
//
//    User.findAll({where:{name: "Tom"}, raw: true })
//.then(users=>{
//  console.log(users);
//}).catch(err=>console.log(err));
//
//  return new Promise(function(resolve, reject) {
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
    let date1 = bodyDate[0];
    let date2 = bodyDate[1] ? bodyDate[1] : bodyDate[0];
    let teacherIds = body.teacherIds;
    let {status,page, lessonsPerPage, studentsCount} = body;
    
    console.log(date1,date2, status, teacherIds)

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
    lessons.date >= '${date1}' AND
    lessons.date <= '${date2}' AND
    lessons.status = ${status} AND
    lessons.id = lesson_teachers.lesson_id AND
    lesson_teachers.teacher_id IN ( ${teacherIds}) AND
      
    ${studentsCount} = (
      select count(*)
      from lesson_students
      where
        lesson_students.lesson_id = lessons.id
    ) 
      
      
`,

  //limit ${lessonsPerPage}
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

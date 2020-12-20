
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

const getList = (str, maxQuantity) => {
  console.log(/^\d+$/.test(str), 'str')
  let arr = str === undefined || str === '' ? [0, maxQuantity]: /^\d+$/.test(str) ? [str] : str.split(',') ;
  let list = '';
  if(arr.length == 2){
     for(let i = arr[0]; i <= arr[1]; i++){
       list += i < arr[1] ? i + ',' :   i   ;
      }
  }else{
    list = arr[0]
  }
  console.log(list,333)
  return list;
}

const filteringFunc = (body) => {
  console.log(body)
  return new Promise(function(resolve, reject) {
    let bodyDate = body.date.split(',');

    let date1 = body.date !== undefined && body.date !== ''? bodyDate[0] : ['2000-01-01'];

    let date2 = body.date === undefined || body.date === '' ? ['2040-01-01'] : bodyDate[1] ? bodyDate[1] : bodyDate[0];

    let status = body.status == '0' || body.status == '1' ?  body.status: '0,1';
    let teacherIds =  body.teacherIds !== '' && body.teacherIds !== undefined ?  body.teacherIds : '1,2,3,4,5,6,7,8,9,10';
    let studentsCount = getList(body.studentsCount, 10);
    let page = body.page ? body.page : 1;
    let lessonsPerPage = body.lessonsPerPage ? body.lessonsPerPage : 5;
    let offset = lessonsPerPage * page - lessonsPerPage;

    let sqlCommPart = `

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
    `
    
    let sqlFilters = ` 



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

    `;

    let sqlFullQuery = body.date === '' && body.status === '' && body.teacherIds === '' && body.studentsCount === '' ? sqlCommPart : sqlCommPart + sqlFilters;
    

    
    console.log('d1', date1,'d2', date2,'status', status,'tIds', teacherIds, 'stCount', studentsCount, 'page', page, 'lessPP', lessonsPerPage, 'off', offset)

    pool.query(sqlFullQuery , (error, results) => {
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

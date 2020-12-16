const { Pool } = require('pg')
const config = require('../config');
const Sequelize = require("sequelize");

const sequelize = new Sequelize("mydb", config.POSTGRES_USER, config.POSTGRES_PASS, {
  dialect: "postgres",
  host: "localhost",
  port: "5432"
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

sequelize.sync().then(result=>{
  //console.log("SUCSESS!", result);
})
.catch(err=> console.log("ERROR!!", err));


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
}

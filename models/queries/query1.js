

const query1 = 
  `
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


const query2 = ` 
    
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












module.exports = {
  query1,
  query2
}


const checkDate = (body) => {
  const {date, status, teacherIds, studentsCount,page, lessonsPerPage } = body;

  let dateExp = /^[0-9]{4}-(0[1-9]|1[012])-(0[1-9]|1[0-9]|2[0-9]|3[01])$|^[0-9]{4}-(0[1-9]|1[012])-(0[1-9]|1[0-9]|2[0-9]|3[01]),[0-9]{4}-(0[1-9]|1[012])-(0[1-9]|1[0-9]|2[0-9]|3[01])$/;
  let teacherIdsExp = /^\d$|^\d,\d$|^\d,\d,\d$|^\d,\d,\d,\d$/;
  let studentCountExp = /^\d+$|^\d+,\d+$/;
  let pageExp = /^\d+$/;
  let lessonsPerPageExp = /^\d+$/;

  let dateTested = dateExp.test(date) || date === '' || date === undefined ? true : false;
  let statusTested =  /[0|1]/.test(status) || status === ''  || status === undefined   ? true : false;
  let teacherIdTested = teacherIdsExp.test(teacherIds)  || teacherIds  === undefined  || teacherIds === '' ? true : false;
  let studentCountTested = studentCountExp.test(studentsCount) || studentsCount === ''  || studentsCount === undefined   ? true : false;
  let pageTested = pageExp.test(page)  || page === '' || page === undefined   ? true : false;
  let lessonsPerPageTested = lessonsPerPageExp.test(lessonsPerPage)  || lessonsPerPage === undefined || lessonsPerPage === '' || lessonsPerPage == '' ? true : false


  return dateTested && statusTested && teacherIdTested && studentCountTested && pageTested && lessonsPerPageTested;
}

module.exports = {
  checkDate  
}

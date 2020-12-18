
const checkDate = (body) => {
  const {date, status, teacherIds, studentsCount,page, lessonsPerPage } = body;

  let dateExp = /^[0-9]{4}-(0[1-9]|1[012])-(0[1-9]|1[0-9]|2[0-9]|3[01])$|^[0-9]{4}-(0[1-9]|1[012])-(0[1-9]|1[0-9]|2[0-9]|3[01]),[0-9]{4}-(0[1-9]|1[012])-(0[1-9]|1[0-9]|2[0-9]|3[01])$/;
  let teacherIdsExp = /^\d$|^\d,\d$|^\d,\d,\d$/;
  let studentCountExp = /^\d+$|^\d+,\d+$/;
  let pageExp = /\d+/;
  let lessonsPerPageExp = /\d+/;
  let dateTested = dateExp.test(date) || date === undefined ? true : false;
  let statusTested =  /[0|1]/.test(status)  || status === undefined   ? true : false;
  let teacherIdTested = teacherIdsExp.test(teacherIds)  || teacherIds  === undefined   ? true : false;
  console.log(dateTested , statusTested , teacherIdTested)
  console.log(date, status, teacherIds)

  return dateTested && statusTested && teacherIdTested;
}

module.exports = {
  checkDate  
}

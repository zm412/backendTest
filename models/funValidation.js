
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

const prepareData = (body) => {
  let bodyDate = body.date.split(',');

  let date1 = body.date !== undefined && body.date !== ''? bodyDate[0] : ['2000-01-01'];

  let date2 = body.date === undefined || body.date === '' ? ['2040-01-01'] : bodyDate[1] ? bodyDate[1] : bodyDate[0];

  let status = body.status == '0' || body.status == '1' ?  body.status: '0,1';
  let teacherIds =  body.teacherIds !== '' && body.teacherIds !== undefined ?  body.teacherIds : '1,2,3,4,5,6,7,8,9,10';
  let studentsCount = getList(body.studentsCount, 10);
  let page = body.page ? body.page : 1;
  let lessonsPerPage = body.lessonsPerPage ? body.lessonsPerPage : 5;
  let offset = lessonsPerPage * page - lessonsPerPage;
  
    return {date1: date1, date2: date2, status: status, teacherIds: teacherIds, studentsCount: studentsCount, page: page, lessonsPerPage: lessonsPerPage, offset: offset }

}



module.exports = {
  checkDate  ,
  prepareData
}

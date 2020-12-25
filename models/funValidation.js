

const getList = (str, maxQuantity) => {
  let arr = str === undefined || str === '' ? [0, maxQuantity]: /^\d+$/.test(str) ? [str] : str.split(',') ;
  let list = '';
  if(arr.length == 2){
     for(let i = arr[0]; i <= arr[1]; i++){
       list += i < arr[1] ? i + ',' :   i   ;
      }
  }else{
    list = arr[0]
  }
  return list;
}

const prepareData = (body) => {

  let date1 = body.date1 === undefined || body.date1 === ''? '2000-01-01' : body.date1;

  let date2 = body.date2 !== undefined && body.date2 !== '' ? body.date2 : body.date1? body.date1 : '2040-01-01'; 

  let status = body.status == '0' || body.status == '1' ?  body.status : '0,1';
  let teacherIds =  body.teacherIds !== '' && body.teacherIds !== undefined ?  body.teacherIds : '1,2,3,4,5,6,7,8,9,10';
  let studentsCount = getList(body.studentsCount, 10);
  let page = body.page ? body.page : 1;
  let lessonsPerPage = body.lessonsPerPage ? body.lessonsPerPage : 5;
  let offset = lessonsPerPage * page - lessonsPerPage;
  
    return {date1: date1, date2: date2, status: status, teacherIds: teacherIds, studentsCount: studentsCount, page: page, lessonsPerPage: lessonsPerPage, offset: offset }

}



module.exports = {
  prepareData
}

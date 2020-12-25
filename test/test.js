const chai = require('chai');
const validationTools = require('../models/funValidation')
let assert = chai.assert;


let {prepareData} = validationTools;


describe("prepareData", function() {

  it("приводит объект к общему виду", function() {
    assert.deepEqual(prepareData({date1: '2019-05-13', date2:'', status: '0', teacherIds: '1', studentsCount: '3,9', page: 2, lessonsPerPage: 20 }), {date1: '2019-05-13', date2:'2019-05-13', status:'0', teacherIds:'1', studentsCount: '3,4,5,6,7,8,9', page: 2, lessonsPerPage: 20, offset:20 });

    assert.deepEqual(prepareData({date1: '2019-05-13', date2: '2019-09-20', status: '0', teacherIds: '1', studentsCount: '3,9', page: 2, lessonsPerPage: 20 }), {date1: '2019-05-13', date2:'2019-09-20', status:'0', teacherIds:'1', studentsCount: '3,4,5,6,7,8,9', page: 2, lessonsPerPage: 20, offset:20 });

    assert.deepEqual(prepareData({date1: '', date2: '', status: '0', teacherIds: '1', studentsCount: '3,9', page: 2, lessonsPerPage: 20 }), {date1: '2000-01-01', date2:'2040-01-01', status:'0', teacherIds:'1', studentsCount: '3,4,5,6,7,8,9', page: 2, lessonsPerPage: 20, offset:20 });
  });

});



//
//describe("checkDate", function() {
//
//  it("одна дата (или, пустая строка), из всего списка аргументов", function() {
//    assert.equal(checkDate({date: '2019-05-13'}), true);
//    assert.equal(checkDate({date: ''}), true);
//    assert.equal(checkDate({date: '201ljljlj9-05-13'}), false);
//    assert.equal(checkDate({date: '2019-5-13'}), false);
//    assert.equal(checkDate({date: '2oo9-5-13'}), false);
//  });
//
//  it("вводим две даты через запятую (временной промежуток), из всего списка аргументов", function() {
//    assert.equal(checkDate({date: '2019-05-13,2019-08-20'}), true);
//    assert.equal(checkDate({date: '2019-05-13,2019-08-20'}), true);
//    assert.equal(checkDate({date: '-05-13,2019-08-20'}), false);
//    assert.equal(checkDate({date: '2019-05-13.2019-08-20'}), false);
//    assert.equal(checkDate({date: '2019-05-13,20oo-08-20'}), false);
//  });
//
//  it("проверка статуса", function() {
//    assert.equal(checkDate({status: '0'}), true);
//    assert.equal(checkDate({status: '1'}), true);
//    assert.equal(checkDate({date: '2019-05-13', status: '1'}), true);
//    assert.equal(checkDate({date: '2019-05-13,2019-09-20', status: '0'}), true);
//    assert.equal(checkDate({date: '2019-05-13, 2019-09-20', status: '0'}), true);
//    assert.equal(checkDate({status: ''}), true);
//    assert.equal(checkDate({}), true);
//    assert.equal(checkDate({status: 'p'}), false);
//    assert.equal(checkDate({status: '5'}), false);
//    assert.equal(checkDate({date: '2019-05-13,20oo-08-20',status: '5'}), false);
//  });
//
//  it("проверка корректности teacherIds", function() {
//    assert.equal(checkDate({teacherIds: '1'}), true);
//    assert.equal(checkDate({teacherIds: '8'}), true);
//    assert.equal(checkDate({teacherIds: '8,3,5,6'}), true);
//    assert.equal(checkDate({teacherIds: '8, 3, 5,6'}), true);
//    assert.equal(checkDate({teacherIds: '8,a,5,6'}), false);
//    assert.equal(checkDate({teacherIds: 'r'}), false);
//    assert.equal(checkDate({}), true);
//  });
//
//  it("проверка корректности studentsCount", function() {
//    assert.equal(checkDate({studentsCount: '1'}), true);
//    assert.equal(checkDate({studentsCount: '5'}), true);
//    assert.equal(checkDate({studentsCount: '5,9'}), true);
//    assert.equal(checkDate({studentsCount: '5, 9'}), true);
//    assert.equal(checkDate({studentsCount: '5,a'}), false);
//    assert.equal(checkDate({studentsCount: 'a'}), false);
//    assert.equal(checkDate({studentsCount: 'k99'}), false);
//    assert.equal(checkDate({}), true);
//  });
//
// it("проверка корректности page", function() {
//    assert.equal(checkDate({page: '1'}), true);
//    assert.equal(checkDate({page: '3234234'}), true);
//    assert.equal(checkDate({page: '3234a34'}), false);
//    assert.equal(checkDate({page: '3,5'}), false);
//    assert.equal(checkDate({page: 'r'}), false);
//    assert.equal(checkDate({}), true);
//  });
//
// it("проверка корректности lessonsPerPage", function() {
//    assert.equal(checkDate({lessonsPerPage: '1'}), true);
//    assert.equal(checkDate({lessonsPerPage: '3234234'}), true);
//    assert.equal(checkDate({lessonsPerPage: '3234a34'}), false);
//    assert.equal(checkDate({lessonsPerPage: '3,5'}), false);
//    assert.equal(checkDate({lessonsPerPage: 'r'}), false);
//    assert.equal(checkDate({}), true);
//  });
//
// it("проверка всего объекта", function() {
//    assert.equal(checkDate({date: '2019-05-13', status: '0', teacherIds: '1', studentsCount: '9', page: 12, lessonsPerPage: 20 }), true);
//
//    assert.equal(checkDate({date: '2019-05-13,2019-09-20', status: '0', teacherIds: '1', studentsCount: '9', page: 12, lessonsPerPage: 20 }), true);
//   
//    assert.equal(checkDate({date: '2019-05-13', status: 'a', teacherIds: '1', studentsCount: '9', page: 12, lessonsPerPage: 20 }), false);
//
//    assert.equal(checkDate({}), true);
//  });
//
//});
//
//

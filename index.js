const lesson_model = require('./models/lesson_model')
const validationTools = require('./models/funValidation')
const bodyParser = require("body-parser");
const express = require('express');
const { check, validationResult } = require('express-validator');

const app = express();

const port = 3001;
const urlencodedParser = bodyParser.urlencoded({extended: false});

app.use(express.json())
const path = require('path');
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());


app.get("/", function(req, res){
  res.sendFile(__dirname + "/index.html");
});

app.post('/',[
  check('date1').matches(/^(19|20)\d\d-((0[1-9]|1[012])-(0[1-9]|[12]\d)|(0[13-9]|1[012])-30|(0[13578]|1[02])-31)$|^$/).trim().escape(),
  check('date2').matches(/^(19|20)\d\d-((0[1-9]|1[012])-(0[1-9]|[12]\d)|(0[13-9]|1[012])-30|(0[13578]|1[02])-31)$|^$/).trim().escape(),
  check('status').optional().matches(/^0|1$|^$/).trim().escape(),
  check('teacherIds').matches(/^(\d)+(,\s*(\d)+)*$|^$/).trim().escape(),
  check('studentsCount').matches(/^(\d)+(,\s*(\d)+)?$|^$/).trim().escape(),
  check('page').matches(/^\d+$|^$/).trim().escape(),
  check('lessonsPerPage').matches(/^\d+$|^$/).trim().escape()

],  (req, res) => {
  console.log('reqURL', req.body)

  const errors = validationResult(req);
  console.log(errors)
  if(!errors.isEmpty()){
    return res.status(500).json({
      errors: errors.array()
    })

  }else{
     lesson_model.filteringFunc(req.body)
      .then(response => {
        res.status(200).send(response);
    })
    .catch(err => {
      console.log(err)
      res.status(500).send(err);
    })
  }

})




app.get("/lessons", function(req, res){
  res.sendFile(__dirname + "/lessons.html");
});


app.post('/lessons', (req, res) => {
  console.log('reqBody',req.body)
  lesson_model.createLesson(req.body)
  .then(response => {
    res.status(200).send(response);
  })
  .catch(error => {
    res.status(500).send(error);
  })
})



app.delete('/lessons/:id', (req, res) => {
  lesson_model.deleteLesson(req.params.id)
  .then(response => {
    res.status(200).send(response);
  })
  .catch(error => {
    res.status(500).send(error);
  })
})

app.listen(port, () => {
  console.log(`App running on port ${port}.`)
})


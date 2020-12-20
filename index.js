const lesson_model = require('./models/lesson_model')
const validationTools = require('./models/funValidation')
const bodyParser = require("body-parser");
const { body, validationResult } = require('express-validator');
const express = require('express');
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

app.post('/', (req, res) => {
  console.log('reqURL', req.query)
  console.log(validationTools.checkDate(req.body), 'kjlj')

  let checked = validationTools.checkDate(req.body)
  if(!checked){
    res.status (500).send('sorry, try again')
  }else{
    lesson_model.filteringFunc(req.body)
    .then(response => {
      res.status(200).send(response);
  })
  .catch(error => {
    console.log(error)
    res.status(500).send(error);
  })
  }
})




app.post('/lessons', (req, res) => {
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


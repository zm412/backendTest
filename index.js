const lesson_model = require('./models/lesson_model')

const express = require('express');
const app = express();
const port = 3001;

app.use(express.json())
app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Access-Control-Allow-Headers');
  next();
});


app.get(/\/*/, (req, res) => {
  console.log('reqURL', req.query.name)
  let url = 'https://www.example.com?name=n1&name=n2';
  let params = (new URL(url)).searchParams;
  let name1 = params.get('name');
  let name2 = params.getAll('name');
  console.log(name1)
  console.log(name2)

  lesson_model.getLessons()
  .then(response => {
    res.status(200).send(response);
  })
  .catch(error => {
    res.status(500).send(error);
  })
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


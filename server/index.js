const express = require('express');
const app     = express();
const cors    = require('cors');
const dal     = require('./dal.js');

// serve static files from public library
// app.use(express.static('public'));
app.use(cors());

// create user account route
app.get('/account/create/:name/:email/:password', function (req, res) {
  dal.create(req.params.name, req.params.email, req.params.password)
    .then((user) => {
      console.log(user);
      res.send(user);
    })
});

// user login route
app.get('/account/login/:email/:password', function (req, res) {
  res.send({
    email:    req.params.email,
    password: req.params.password,
  });
});

// all users route
app.get('/account/all', async function (req, res) {
  await dal.all()
  .then((docs) => {
    console.log(docs);
    res.send(docs);
  })
});

let port = 3001;
app.listen(port, () => console.log(`Running on port http://localhost:${port}`));

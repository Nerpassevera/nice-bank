const express = require("express");
const app = express();
const cors = require("cors");
const dal = require("./dal.js");
const path = require('path');

// serve static files from public library
// app.use(express.static('public'));

const bodyParser = require("body-parser");
// app.use(bodyParser.urlencoded());
app.use(bodyParser.json());
app.use(cors());
// app.use(express.json())

// create user account route
app.post("/account/create", function (req, res) {
  dal
    .create(
      req.body.name,
      req.body.email,
      req.body.password,
      req.body.uid,
      req.body.photo,
      req.body.account_number
    )
    .then((user) => {
      dal.operationLogs(
        req.body.email,
        req.body.name,
        `Account for user ${req.body.name} was created`
      );
      res.send(user);
    });
});


// Deposite route
app.post("/balance/operations", function (req, res) {
  dal.balanceOperation(req.body.email, req.body.amount).then((user) => {
    res.send(user);
  });
});

// user login route
app.post("/save-logs", function (req, res) {

  dal.operationLogs(
    req.body.email,
    req.body.operation
  ).then(
    res.send("Done!")
  )
});

// all users route
app.get("/account/all", async function (req, res) {
  await dal.all().then((docs) => {
    res.send(docs);
  });
});

app.get("/account/log-history/:email", async function (req, res) {
  await dal.getLogHistory(req.params.email).then((docs) => {
    res.send(docs);
  });
});

app.get("/account/data/:email", async function (req, res) {
  await dal.getUserData(req.params.email).then((docs) => {
    res.send(docs);
  });
});

app.get("/account/balance/:email", async function (req, res) {
  await dal.getUserBalance(req.params.email).then((docs) => {
    res.send(docs);
  });
});

// Serve static files from the React frontend app
app.use(express.static(path.join(__dirname, 'client/build')));
// Anything that doesn't match the above, send back index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname + '/client/build/index.html'))
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
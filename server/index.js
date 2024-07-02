const express = require("express");
const app = express();
const cors = require("cors");
const dal = require("./dal.js");

// serve static files from public library
// app.use(express.static('public'));

const bodyParser = require("body-parser");
// app.use(bodyParser.urlencoded());
app.use(bodyParser.json());
app.use(cors());
// app.use(express.json())

// create user account route
app.post("/account/create", function (req, res) {
  console.log("REQUEST BODY:", req.body);
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
      console.log(user);
      res.send(user);
    });
});


// Deposite route
app.post("/balance/operations", function (req, res) {
  console.log("REQUEST BODY:", req.body);
  dal.balanceOperation(req.body.email, req.body.amount).then((user) => {
    console.log(user);
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
    console.log(docs);
    res.send(docs);
  });
});

app.get("/account/log-history/:email", async function (req, res) {
  await dal.getLogHistory(req.params.email).then((docs) => {
    console.log(docs);
    console.log(typeof(docs));
    res.send(docs);
  });
});

app.get("/account/balance/:email", async function (req, res) {
  console.log("EXPRESS >> req.params.email: ", req.params.email);
  await dal.getUserBalance(req.params.email).then((docs) => {
    console.log("INDEX >> balance:", docs)
    res.send(docs);
  });
});

let port = 3001;
app.listen(port, () => console.log(`Running on port http://localhost:${port}`));

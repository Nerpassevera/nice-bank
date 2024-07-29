const express = require("express");
const app = express();
const cors = require("cors");
const dal = require("./dal.js");
const path = require('path');
const admin = require("./admin.js");

const bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(cors());

async function checkToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  console.log("AUTHHEADER:", authHeader);
  const idToken = authHeader && authHeader.split(' ')[1];
  console.log("idTOKEN:", idToken);
  console.log('idToken in the header of checkToken:', idToken);

  if (!idToken) {
    return res.status(401).send('Unauthorized: No token provided');
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    console.log('decodedToken:', decodedToken);
    req.user = decodedToken;
    next(); // Продолжаем выполнение следующих middleware или маршрута
  } catch (error) {
    console.log('error:', error);
    return res.status(401).send('Unauthorized: Invalid token');
  }
}

// create user account route
app.post("/account/create", checkToken, function (req, res) {
  dal.create(
    req.body.name,
    req.body.email,
    req.body.password,
    req.body.uid,
    req.body.photo,
    req.body.account_number
  ).then((user) => {
    dal.operationLogs(
      req.body.email,
      req.body.name,
      `Account for user ${req.body.name} was created`
    );
    res.send(user);
  }).catch((error) => {
    res.status(500).send("Server error");
  });
});

// Deposit route
app.post("/balance/operations", checkToken, function (req, res) {
  dal.balanceOperation(req.body.email, req.body.amount).then((user) => {
    res.send(user);
  }).catch((error) => {
    res.status(500).send("Server error");
  });
});

// user login route
app.post("/save-logs", checkToken, function (req, res) {
  dal.operationLogs(req.body.email, req.body.operation).then(() => {
    res.send("Done!");
  }).catch((error) => {
    res.status(500).send("Server error");
  });
});

// all users route
app.get("/account/all", checkToken, async function (req, res) {
  try {
    const docs = await dal.all();
    res.send(docs);
  } catch (error) {
    res.status(500).send("Server error");
  }
});

app.get("/account/log-history/:email", checkToken, async function (req, res) {
  try {
    const docs = await dal.getLogHistory(req.params.email);
    res.send(docs);
  } catch (error) {
    res.status(500).send("Server error");
  }
});

app.get("/account/data/:email", checkToken, async function (req, res) {
  try {
    const email = req.params.email;
    console.log("Inside express: ", email);
    const docs = await dal.getUserData(email);
    res.send(docs);
  } catch (error) {
    console.error("Error fetching user data:", error);
    res.status(500).send("Server error");
  }
});

app.get("/account/balance/:email", checkToken, async function (req, res) {
  try {
    const docs = await dal.getUserBalance(req.params.email);
    res.send(docs);
  } catch (error) {
    res.status(500).send("Server error");
  }
});

app.get("/account/users/:email", checkToken, async function (req, res) {
  try {
    const docs = await dal.getRecipient(req.params.email);
    res.send(docs);
  } catch (error) {
    res.status(500).send("Server error");
  }
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
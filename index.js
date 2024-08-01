const express = require("express");
const app = express();
const cors = require("cors");
const dal = require("./dal.js");
const path = require("path");
const admin = require("./admin.js");

const bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(cors());

/**
 * Middleware function to check the Firebase token.
 * Verifies the token provided in the request header and attaches the decoded token to the request object.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @returns {void}
 */
async function checkToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const idToken = authHeader && authHeader.split(" ")[1];

  if (!idToken) {
    return res.status(401).send("Unauthorized: No token provided");
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    req.user = decodedToken;
    next();
  } catch (error) {
    console.error("Authentication token error:", error);
    return res.status(401).send("Unauthorized: Invalid token");
  }
}

/**
 * Route to create a new user account.
 * Requires Firebase token verification.
 * @param {string} req.body.name - The name of the user.
 * @param {string} req.body.email - The email address of the user.
 * @param {string} req.body.password - The password for the user's account.
 * @param {string} req.body.uid - The unique identifier for the user.
 * @param {string} req.body.photo - The URL to the user's profile photo.
 * @param {string} req.body.account_number - The user's bank account number.
 * @returns {Object} - The created user document.
 */
app.post("/account/create", checkToken, function (req, res) {
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
    })
    .catch((error) => {
      res.status(500).send("Server error");
    });
});

/**
 * Route to handle balance operations (deposits).
 * Requires Firebase token verification.
 * @param {string} req.body.email - The email address of the user.
 * @param {number} req.body.amount - The amount to be deposited.
 * @returns {Object} - The updated account document.
 */
app.post("/balance/operations", checkToken, function (req, res) {
  dal
    .balanceOperation(req.body.email, req.body.amount)
    .then((user) => {
      res.send(user);
    })
    .catch((error) => {
      res.status(500).send("Server error");
    });
});

/**
 * Route to save operation logs.
 * Requires Firebase token verification.
 * @param {string} req.body.email - The email address of the user.
 * @param {string} req.body.operation - The description of the operation performed.
 * @returns {string} - Confirmation message.
 */
app.post("/save-logs", checkToken, function (req, res) {
  dal
    .operationLogs(req.body.email, req.body.operation)
    .then(() => {
      res.send("Done!");
    })
    .catch((error) => {
      res.status(500).send("Server error");
    });
});

/**
 * Route to get all user accounts.
 * Requires Firebase token verification.
 * @returns {Array} - An array of all user documents.
 */
app.get("/account/all", checkToken, async function (req, res) {
  try {
    const docs = await dal.all();
    res.send(docs);
  } catch (error) {
    res.status(500).send("Server error");
  }
});

/**
 * Route to get operation log history for a user.
 * Requires Firebase token verification.
 * @param {string} req.params.email - The email address of the user.
 * @returns {Array} - An array of operation log documents for the user.
 */
app.get("/account/log-history/:email", checkToken, async function (req, res) {
  try {
    const docs = await dal.getLogHistory(req.params.email);
    res.send(docs);
  } catch (error) {
    res.status(500).send("Server error");
  }
});

/**
 * Route to get user data by email.
 * Requires Firebase token verification.
 * @param {string} req.params.email - The email address of the user.
 * @returns {Object} - The user data document.
 */
app.get("/account/data/:email", checkToken, async function (req, res) {
  try {
    const email = req.params.email;
    const docs = await dal.getUserData(email);
    res.send(docs);
  } catch (error) {
    console.error("Error fetching user data:", error);
    res.status(500).send("Server error");
  }
});

/**
 * Route to get user balance by email.
 * Requires Firebase token verification.
 * @param {string} req.params.email - The email address of the user.
 * @returns {string} - The balance of the user as a string.
 */
app.get("/account/balance/:email", checkToken, async function (req, res) {
  try {
    const docs = await dal.getUserBalance(req.params.email);
    res.send(docs);
  } catch (error) {
    res.status(500).send("Server error");
  }
});

/**
 * Route to check if a recipient exists by email.
 * Requires Firebase token verification.
 * @param {string} req.params.email - The email address of the recipient.
 * @returns {boolean} - True if the recipient exists, otherwise false.
 */
app.get("/account/users/:email", checkToken, async function (req, res) {
  try {
    const docs = await dal.getRecipient(req.params.email);
    res.send(docs);
  } catch (error) {
    res.status(500).send("Server error");
  }
});

// Serve static files from the React frontend app
app.use(express.static(path.join(__dirname, "client/build")));
// Anything that doesn't match the above, send back index.html
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname + "/client/build/index.html"));
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

const express = require("express");
const app = express();
const cors = require("cors");
const dal = require("./dal.js");
const path = require("path");
const admin = require("./admin.js");
const bodyParser = require("body-parser");
const swaggerJSDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

app.use(bodyParser.json());
app.use(cors());

const swaggerOptions = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "Nice Bank API",
      version: "1.0.0",
      description: "API documentation for the Nice Bank application",
    },
    servers: [
      {
        url: "http://localhost:3001/",
        // url: "https://young-retreat-58707-f1d87c2fb5a2.herokuapp.com/api-docs/",
      },
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [
      {
        BearerAuth: [],
      },
    ],
  },
  apis: ["./index.js"],
};
const swaggerDocs = swaggerJSDoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

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
 * @swagger
 * /account/create:
 *   post:
 *     summary: Create a new user account record.
 *     description: Creates a new record in the database for a newly registered account.
 *     tags: [Account]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *               - uid
 *               - photo
 *               - account_number
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               uid:
 *                 type: string
 *               photo:
 *                 type: string
 *               account_number:
 *                 type: string
 *     responses:
 *       200:
 *         description: User account created successfully
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
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
 * @swagger
 * /balance/operations:
 *   post:
 *     summary: Handle balance operations (deposits and withdraws)
 *     description: Deposits or withdraws a specified amount into a user's account. Use positive balance for deposite and negative - for withdraws.
 *     tags: [Balance]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               amount:
 *                 type: number
 *     responses:
 *       200:
 *         description: Balance operation successful
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
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
 * @swagger
 * /save-logs:
 *   post:
 *     summary: Save operation logs
 *     description: Logs an operation performed by a user in the database.
 *     tags: [Logs]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               operation:
 *                 type: string
 *     responses:
 *       200:
 *         description: Log saved successfully
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
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
 * @swagger
 * /account/log-history/{email}:
 *   get:
 *     summary: Get operation log history for a user
 *     description: Retrieves the operation log history for a user.
 *     tags: [Logs]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: email
 *         required: true
 *         schema:
 *           type: string
 *         description: The email address of the user
 *     responses:
 *       200:
 *         description: A list of operation log documents
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
app.get("/account/log-history/:email", checkToken, async function (req, res) {
  try {
    const docs = await dal.getLogHistory(req.params.email);
    console.log("Success!", docs);
    res.send(docs);
  } catch (error) {
    console.log(error);
    res.status(500).send("Server error");
  }
});

/**
 * @swagger
 * /account/data/{email}:
 *   get:
 *     summary: Get user data by email
 *     description: Retrieves user data by email.
 *     tags: [Account]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: email
 *         required: true
 *         schema:
 *           type: string
 *         description: The email address of the user
 *     responses:
 *       200:
 *         description: User data document
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
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
 * @swagger
 * /account/balance/{email}:
 *   get:
 *     summary: Get user balance by email
 *     tags: [Account]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: email
 *         schema:
 *           type: string
 *         required: true
 *         description: The user's email address
 *     responses:
 *       200:
 *         description: Successful operation
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
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
 * @swagger
 * /account/users/{email}:
 *   get:
 *     summary: Check if a recipient exists by email
 *     description: Checks if a recipient exists by email.
 *     tags: [Account]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: email
 *         required: true
 *         schema:
 *           type: string
 *         description: The email address of the recipient
 *     responses:
 *       200:
 *         description: True if the recipient exists, otherwise false
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
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


const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

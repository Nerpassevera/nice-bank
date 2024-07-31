require("dotenv").config();
const { MongoClient } = require("mongodb");
const url = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@atlascluster.nnu49ja.mongodb.net/?retryWrites=true&w=majority&appName=AtlasCluster`;

let db = null;

/**
 * Connects to the MongoDB server.
 */
async function connectClient() {
  const client = new MongoClient(url, { useUnifiedTopology: true });

  try {
    await client.connect();
    console.log("Connected successfully to MongoDB server!");
    db = client.db("bad-bank-db");
  } catch (err) {
    console.error(err);
  }
}

/**
 * Creates a new user account in the database.
 * @param {string} name - The name of the user.
 * @param {string} email - The email address of the user.
 * @param {string} password - The password for the user's account.
 * @param {string} uid - The unique identifier for the user.
 * @param {string} photo - The URL to the user's profile photo.
 * @param {string} account_number - The user's bank account number.
 * @returns {Promise<Object>} - The created user document.
 */
async function create(name, email, password, uid, photo, account_number) {
  await connectClient();

  const collection = db.collection("users");
  const doc = { name, email, password, uid, balance: 0, photo, account_number };

  try {
    const result = await collection.insertOne(doc);
    return doc;
  } catch (err) {
    console.error(err);
    throw err;
  }
}

/**
 * Logs user operations.
 * @param {string} email - The email address of the user.
 * @param {string} operation - Description of the operation performed.
 * @returns {Promise<Object>} - The created operation log document.
 */
async function operationLogs(email, operation) {
  const timeStamp = new Date().toLocaleString();

  await connectClient();

  const collection = db.collection("operation-history");
  const doc = { timeStamp, email, operation };

  try {
    const result = await collection.insertOne(doc);
    return doc;
  } catch (err) {
    console.error(err);
    throw err;
  }
}

/**
 * Performs balance operations for a user.
 * @param {string} uid - The unique identifier for the user.
 * @param {number} amount - The amount to be added or subtracted from the user's balance.
 * @returns {Promise<Object>} - The updated account document.
 */
async function balanceOperation(uid, amount) {
  await connectClient();

  const collection = db.collection("users");

  try {
    const updatedAccount = await collection.updateOne(
      { email: uid },
      { $inc: { balance: amount } }
    );

    return updatedAccount;
  } catch (err) {
    console.error(err);
    throw err;
  }
}

/**
 * Gets the balance of a user by email.
 * @param {string} email - The email address of the user.
 * @returns {Promise<string>} - The balance of the user as a string.
 */
async function getUserBalance(email) {
  await connectClient();

  const collection = db.collection("users");
  const query = { email: email };
  const options = {
    projection: {
      _id: 0,
      balance: 1.0,
    },
  };

  var cursor = await collection.findOne(query, options);
  return String(cursor.balance);
}

/**
 * Gets user data by email.
 * @param {string} email - The email address of the user.
 * @returns {Promise<Object>} - The user data document.
 */
async function getUserData(email) {
  await connectClient();

  const collection = db.collection("users");
  const query = { email: email };

  var cursor = await collection.findOne(query);
  return cursor;
}

/**
 * Checks if a recipient exists by email.
 * @param {string} email - The email address of the recipient.
 * @returns {Promise<boolean>} - True if the recipient exists, otherwise false.
 */
async function getRecipient(email) {
  await connectClient();

  const collection = db.collection("users");
  const query = { email: email };

  var cursor = await collection.findOne(query);

  return cursor !== null ? true : false;
}

/**
 * Gets all users from the database.
 * @returns {Promise<Array>} - An array of all user documents.
 */
async function all() {
  await connectClient();

  const collection = db.collection("users");

  try {
    const docs = await collection.find({}).toArray();
    return docs;
  } catch (err) {
    console.error(err);
    throw err;
  }
}

/**
 * Gets operation log history for a user by email.
 * @param {string} email - The email address of the user.
 * @returns {Promise<Array>} - An array of operation log documents for the user.
 */
async function getLogHistory(email) {
  await connectClient();

  const collection = db.collection("operation-history");

  try {
    const docs = await collection.find({ email: email }).toArray();
    return docs;
  } catch (err) {
    console.error(err);
    throw err;
  }
}

module.exports = {
  create,
  all,
  balanceOperation,
  operationLogs,
  getUserBalance,
  getUserData,
  getLogHistory,
  getRecipient,
};

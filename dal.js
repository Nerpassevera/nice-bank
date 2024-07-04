require('dotenv').config();
const { MongoClient } = require("mongodb");
const url = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@atlascluster.nnu49ja.mongodb.net/?retryWrites=true&w=majority&appName=AtlasCluster`;
// const url = 'mongodb://localhost:27017';
let db = null;

// connect to mongo
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

// create user account
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

// operation logs
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

async function balanceOperation(uid, amount) {
  await connectClient();
  
  const collection = db.collection("users");
  
  try {
    const updatedAccount = await collection.updateOne(
      { email: uid },
      { $inc: { balance: amount } },
    );
    
    return updatedAccount;
  } catch (err) {
    console.error(err);
    throw err;
  }
}

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
  console.log("DAL >> cursor: ", cursor, typeof(cursor));
  return String(cursor.balance);
}
async function getUserData(email) {
  await connectClient();
  
  const collection = db.collection("users");
  const query = { email: email };
  const options = {
    // projection: {
    //   _id: 0,
    //   balance: 1.0,
    // },
  };
  
  var cursor = await collection.findOne(query);
  console.log("DAL >> cursor: ", cursor, typeof(cursor));
  return cursor;
}
// get all users
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
async function getLogHistory(email) {
  await connectClient();
  
  const collection = db.collection("operation-history");
  
  try {
    const docs = await collection.find({ email: email}).toArray();
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
  getLogHistory
};

const { MongoClient } = require("mongodb");
const url = "mongodb://localhost:27017";
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
async function create(name, email, password) {
  await connectClient();

  const collection = db.collection("users");
  const doc = { name, email, password, balance: 0 };

  try {
    const result = await collection.insertOne(doc);
    return doc;
  } catch (err) {
    console.error(err);
    throw err;
  }
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

module.exports = { create, all };

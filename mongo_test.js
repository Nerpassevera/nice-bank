const { MongoClient } = require("mongodb");

// Replace the uri string with your connection string.
const uri = "mongodb://localhost:27017";

const client = new MongoClient(uri);

async function run() {
  try {
    
    await client.connect(()=>console.log('connected'));

    const database = client.db('test_mongodb_db');

    let username = 'user' + Math.floor(Math.random() * 10000);
    let email = username + '@email.com';

    const collection = database.collection('test_collection');
    const doc = { username, email };

    await collection.insertOne( doc, {w:1});
    console.log('Document insert');


  } finally {
    await client.close();
  }
};


run().catch(console.dir);
const admin = require("firebase-admin");
require("dotenv").config();

// Check if the FIREBASE_ADMIN_KEY environment variable is set
if (!process.env.FIREBASE_ADMIN_KEY) {
  // If not, throw an error to prevent the application from running without it
  throw new Error("FIREBASE_ADMIN_KEY environment variable is not set");
}

// Retrieve the base64-encoded Firebase private key from the environment variable
const firebase_private_key_b64 = process.env.FIREBASE_ADMIN_KEY;

// Decode the base64-encoded private key to get the original UTF-8 string
const firebase_private_key = Buffer.from(
  firebase_private_key_b64,
  "base64"
).toString("utf8");

// Firebase configuration variable
const serviceAccount = {
  type: "service_account",
  project_id: "nice-bank-7b37a",
  private_key_id: "514f407f93ca7331d1174de022a07ef5996f8930",
  private_key: firebase_private_key,
  client_email:
    "firebase-adminsdk-5sk9v@nice-bank-7b37a.iam.gserviceaccount.com",
  client_id: "117080535662412900181",
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
  client_x509_cert_url:
    "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-5sk9v%40nice-bank-7b37a.iam.gserviceaccount.com",
  universe_domain: "googleapis.com",
};

// Initialize the Firebase Admin SDK using the provided service account credentials
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// Export the initialized admin instance for use in other parts of the application
module.exports = admin;

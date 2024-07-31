const admin = require('firebase-admin');
require('dotenv').config();

// Firebase service account
const type = "service_account";
const project_id = "nice-bank-7b37a";
const private_key_id = "514f407f93ca7331d1174de022a07ef5996f8930";
const firebase_private_key_b64 = Buffer.from(process.env.FIREBASE_ADMIN_KEY, 'base64');
const firebase_private_key = firebase_private_key_b64.toString('utf8');
const client_email = "firebase-adminsdk-5sk9v@nice-bank-7b37a.iam.gserviceaccount.com";
const client_id = "117080535662412900181";
const auth_uri = "https://accounts.google.com/o/oauth2/auth";
const token_uri = "https://oauth2.googleapis.com/token";
const auth_provider_x509_cert_url = "https://www.googleapis.com/oauth2/v1/certs";
const client_x509_cert_url = "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-5sk9v%40nice-bank-7b37a.iam.gserviceaccount.com";
const universe_domain = "googleapis.com";

console.log("firebase_private_key_b64: ", firebase_private_key_b64);
console.log("firebase_private_key", firebase_private_key);

admin.initializeApp({
  credential: admin.credential.cert({
    type,
    project_id,
    private_key_id,
    private_key: firebase_private_key,
    client_email,
    client_id,
    auth_uri,
    token_uri,
    auth_provider_x509_cert_url,
    client_x509_cert_url,
  })
});

module.exports = admin;
const admin = require('firebase-admin');
require('dotenv').config();

// Firebase service account
const type = "service_account";
const project_id = "nice-bank-7b37a";
const private_key_id = "43eb8932cc944dc2a64a574ca4b2d174667a2cc8";
const private_key = `${process.env.FIREBASE_ADMIN_KEY}`;
const client_email = "firebase-adminsdk-5sk9v@nice-bank-7b37a.iam.gserviceaccount.com";
const client_id = "117080535662412900181";
const auth_uri = "https://accounts.google.com/o/oauth2/auth";
const token_uri = "https://oauth2.googleapis.com/token";
const auth_provider_x509_cert_url = "https://www.googleapis.com/oauth2/v1/certs";
const client_x509_cert_url = "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-5sk9v%40nice-bank-7b37a.iam.gserviceaccount.com";
const universe_domain = "googleapis.com";

admin.initializeApp({
  credential: admin.credential.cert({
    type,
    project_id,
    private_key_id,
    private_key:
      private_key.replace(/\\n/g,'\n'),
    client_email,
    client_id,
    auth_uri,
    token_uri,
    auth_provider_x509_cert_url,
    client_x509_cert_url,
  })
});

module.exports = admin;
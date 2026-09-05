const { initializeApp, cert } = require("firebase-admin/app");
const fs = require("fs");

const serviceAccountPath =
  process.env.NODE_ENV === "production"
    ? "/etc/secrets/firebase-service-account.json"
    : "./config/firebase-service-account.json";

const serviceAccount = JSON.parse(
  fs.readFileSync(serviceAccountPath, "utf8")
);

initializeApp({
  credential: cert(serviceAccount),
});

console.log("Firebase Admin initialized");

module.exports = true;
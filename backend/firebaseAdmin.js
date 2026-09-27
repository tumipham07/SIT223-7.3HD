const { initializeApp, cert } = require("firebase-admin/app")
const { getFirestore } = require("firebase-admin/firestore")
const fs = require("fs")
const path = require("path")

// Use a credential path supplied by the environment when available.
// Fall back to the local file during normal development.
const serviceAccountPath =
    process.env.FIREBASE_SERVICE_ACCOUNT_PATH ||
    path.join(__dirname, "config", "serviceAccountKey.json")

// Read the Firebase service account securely at runtime
const serviceAccount = JSON.parse(
    fs.readFileSync(serviceAccountPath, "utf8")
)

// Connect the backend to Firebase
initializeApp({
    credential: cert(serviceAccount)
})

// Create the Firestore database connection
const db = getFirestore()

// Export the database so server.js can use it
module.exports = db
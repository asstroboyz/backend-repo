import * as admin from "firebase-admin";
import * as dotenv from "dotenv";

dotenv.config();

const serviceAccount = {
  projectId: process.env.FIREBASE_PROJECT_ID,
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"), // ✅ Perbaiki newline
};

if (!serviceAccount.privateKey) {
  throw new Error("FIREBASE_PRIVATE_KEY is not set in .env file");
}

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
});

const db = admin.firestore();

db.listCollections()
  .then(() => console.log("✅ Connected to Firebase Firestore"))
  .catch((error) => console.error("❌ Firebase connection failed:", error));
export { db };

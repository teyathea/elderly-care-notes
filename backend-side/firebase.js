import { initializeApp, cert } from "firebase-admin/app";
import { getStorage } from "firebase-admin/storage";
import dotenv from 'dotenv';
import serviceAccount from "./serviceAccountKey.json" assert { type: 'json' }; // path to your downloaded Firebase Admin SDK key

dotenv.config();

initializeApp({
  credential: cert(serviceAccount),
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET
});

const bucket = getStorage().bucket();
export { bucket };

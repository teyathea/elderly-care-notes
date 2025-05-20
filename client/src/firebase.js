// Import Firebase modules you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

// Your Firebase config (replace with your actual config)
const firebaseConfig = {
  apiKey: "AIzaSyCvierWRseV0ALtyyH7y0x6SsRvBtx6Rq8",
  authDomain: "medicalrecords-1e272.firebaseapp.com",
  projectId: "medicalrecords-1e272",
  storageBucket: "medicalrecords-1e272.firebasestorage.app",
  messagingSenderId: "1030914793669",
  appId: "1:1030914793669:web:de89387dbf5fb153ef10ac",
  measurementId: "G-898TVC1YKV"
};

// Initialize Firebase app
const app = initializeApp(firebaseConfig);

// Initialize Firebase Storage service
const storage = getStorage(app);

// Export storage to use in other files
export { storage };

// // Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
// // TODO: Add SDKs for Firebase products that you want to use
// // https://firebase.google.com/docs/web/setup#available-libraries


// const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
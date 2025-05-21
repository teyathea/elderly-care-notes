
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCvierWRseV0ALtyyH7y0x6SsRvBtx6Rq8",
  authDomain: "medicalrecords-1e272.firebaseapp.com",
  projectId: "medicalrecords-1e272",
  storageBucket: "medicalrecords-1e272.firebasestorage.app",
  messagingSenderId: "1030914793669",
  appId: "1:1030914793669:web:de89387dbf5fb153ef10ac",
  measurementId: "G-898TVC1YKV"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export default app
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAwCY1tRAE0m9SrlSXSVh6im8NJDYGmd8g",
  authDomain: "scrumik.firebaseapp.com",
  projectId: "scrumik",
  storageBucket: "scrumik.appspot.com",
  messagingSenderId: "480092253511",
  appId: "1:480092253511:web:6774f2fec537fd6a9a3062",
  measurementId: "G-KMNHLLXP8N",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);

export { app, analytics, db };

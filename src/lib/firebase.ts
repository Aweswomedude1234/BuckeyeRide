// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDhz__S3SlxeVYov8YM3rZsFJ2Voza3KtM",
  authDomain: "buckeyeride-8ca52.firebaseapp.com",
  databaseURL: "https://buckeyeride-8ca52-default-rtdb.firebaseio.com",
  projectId: "buckeyeride-8ca52",
  storageBucket: "buckeyeride-8ca52.appspot.com",
  messagingSenderId: "172661990754",
  appId: "1:172661990754:web:c2081794107508a7d2783b",
  measurementId: "G-989RPMBNN6"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);

export { app, auth };

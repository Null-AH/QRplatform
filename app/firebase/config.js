// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCwsXbxYZC2T1EtD0uUrWwjyx5o8wHSotE",
  authDomain: "qrplatform-1d636.firebaseapp.com",
  projectId: "qrplatform-1d636",
  storageBucket: "qrplatform-1d636.firebasestorage.app",
  messagingSenderId: "457044682082",
  appId: "1:457044682082:web:7418222731c604f41cf83b",
  measurementId: "G-GY2N3JW0YT",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

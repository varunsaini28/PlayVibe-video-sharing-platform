// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import {getAuth, GoogleAuthProvider} from "firebase/auth"
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_APIKEY,
  authDomain: "playvibe-d957e.firebaseapp.com",
  projectId: "playvibe-d957e",
  storageBucket: "playvibe-d957e.firebasestorage.app",
  messagingSenderId: "372044964645",
  appId: "1:372044964645:web:93dc5dea1eb8a18c46b0cc"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(app)
const provider = new GoogleAuthProvider()

export {auth,provider}
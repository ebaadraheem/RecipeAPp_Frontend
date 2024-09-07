// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: "recipeapp-68623.firebaseapp.com",
  projectId: "recipeapp-68623",
  storageBucket: "recipeapp-68623.appspot.com",
  messagingSenderId: "112962203301",
  appId: "1:112962203301:web:2710e86135a141910ea74c",
  measurementId: "G-9THP2XPPK5",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);

export { app, analytics, auth };

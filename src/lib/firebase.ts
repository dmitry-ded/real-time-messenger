import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"


const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: "real-time-messenger-1d4d4.firebaseapp.com",
  projectId: "real-time-messenger-1d4d4",
  storageBucket: "real-time-messenger-1d4d4.firebasestorage.app",
  messagingSenderId: "128960305472",
  appId: "1:128960305472:web:d24829f9762419c9b4c2a5"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth();
export const db = getFirestore();
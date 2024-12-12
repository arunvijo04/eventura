import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyDviBBrXIAsP7AiL7J4MoqF8iyouyOvVtg",
  authDomain: "interlink-e50ad.firebaseapp.com",
  projectId: "interlink-e50ad",
  storageBucket: "interlink-e50ad.firebasestorage.app",
  messagingSenderId: "809727957473",
  appId: "1:809727957473:web:141ba1ff8baa992ea7daa0",
};

const app = initializeApp(firebaseConfig);

// Firestore
export const db = getFirestore(app);

// Firebase Authentication
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

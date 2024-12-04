// Import the functions you need from the SDKs
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"; // Firestore for database
import { getAuth } from "firebase/auth"; // Firebase Authentication
import { getAnalytics, isSupported } from "firebase/analytics"; // Firebase Analytics
import { getStorage } from "firebase/storage"; // Firebase Storage

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB_UsVEfabYCILNaMYIIsMHUHuG_mDpU1Q",
  authDomain: "interlink-c5726.firebaseapp.com",
  projectId: "interlink-c5726",
  storageBucket: "interlink-c5726.appspot.com", // Fixed `app` typo
  messagingSenderId: "365111726061",
  appId: "1:365111726061:web:4467354fc50f6e8b06e1e4",
  measurementId: "G-1VYP18C98G"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
const db = getFirestore(app);

// Initialize Authentication
const auth = getAuth(app);

// Initialize Storage
const storage = getStorage(app);

// Initialize Analytics (only if supported)
let analytics;
isSupported().then((supported) => {
  if (supported) {
    analytics = getAnalytics(app);
  } else {
    console.warn("Analytics not supported in this environment.");
  }
});

// Export initialized services
export { app, db, auth, storage, analytics };

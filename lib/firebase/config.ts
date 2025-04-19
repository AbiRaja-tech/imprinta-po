import { initializeApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyBShVU5D44UPPkQpMQ9r_6UPQ36De6Tlo4",
  authDomain: "imprintapo-895d4.firebaseapp.com",
  projectId: "imprintapo-895d4",
  storageBucket: "imprintapo-895d4.firebasestorage.app",
  messagingSenderId: "128106871666",
  appId: "1:128106871666:web:a5592b9b19f53bbe077beb",
  measurementId: "G-K36924C7M9"
};

// Initialize Firebase
let app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
let analytics;

// Only initialize analytics on the client side
if (typeof window !== 'undefined') {
  analytics = getAnalytics(app);
}

// Initialize Firestore
const db = getFirestore(app);

export { app, db }; 
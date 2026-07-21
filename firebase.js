// Import Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";
// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD69ENxn4Y3dLRyanLc1qSCkz3T-W1BZpM", 
  authDomain: "ane-fire-league.firebaseapp.com",
  projectId: "ane-fire-league",
  storageBucket: "ane-fire-league.firebasestorage.app",
  messagingSenderId: "272030191931",
  appId: "1:272030191931:web:7235fa87beebaafaee671e"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
const auth = getAuth(app);
const db = getFirestore(app);

// Export
export { auth, db };
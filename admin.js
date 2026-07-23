import { auth, db } from "./firebase.js";

import {
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

import {
  doc,
  getDoc
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

// Check if the logged-in user is an admin
onAuthStateChanged(auth, async (user) => {

  if (!user) {
    location.href = "index.html";
    return;
  }

  try {

    const adminRef = doc(db, "admins", user.uid);
    const adminSnap = await getDoc(adminRef);

    if (!adminSnap.exists()) {

      alert("Access denied.");

      location.href = "dashboard.html";

      return;

    }

    console.log("Admin authenticated:", user.email);

  } catch (error) {

    console.error(error);

    alert("Failed to verify admin.");

    location.href = "dashboard.html";

  }

});

// Logout
document.getElementById("logoutBtn").addEventListener("click", async () => {

  await signOut(auth);

  location.href = "index.html";

});
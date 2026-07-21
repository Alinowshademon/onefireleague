import { auth, db } from "./firebase.js";

import {
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

import {
  doc,
  getDoc,
  setDoc
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

let currentUser = null;

onAuthStateChanged(auth, async (user) => {

  if (!user) {
    window.location.href = "index.html";
    return;
  }

  currentUser = user;

  try {

    const docRef = doc(db, "players", user.uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {

      const data = docSnap.data();

      document.getElementById("ign").value = data.ign || "";
      document.getElementById("ffuid").value = data.ffuid || "";
      document.getElementById("country").value = data.country || "";
      document.getElementById("phone").value = data.phone || "";

    }

  } catch (error) {
    alert("Error loading profile: " + error.message);
  }

});

document.getElementById("saveBtn").addEventListener("click", async () => {

  if (!currentUser) return;

  try {

    await setDoc(doc(db, "players", currentUser.uid), {

      email: currentUser.email,
      ign: document.getElementById("ign").value.trim(),
      ffuid: document.getElementById("ffuid").value.trim(),
      country: document.getElementById("country").value.trim(),
      phone: document.getElementById("phone").value.trim()

    });

    alert("✅ Profile updated successfully!");

    window.location.href = "profile.html";

  } catch (error) {

    alert("Error saving profile: " + error.message);

  }

});
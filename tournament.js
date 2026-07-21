import { auth, db } from "./firebase.js";

import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

import {
  doc,
  getDoc,
  setDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

let currentUser = null;

onAuthStateChanged(auth, async (user) => {
  
  if (!user) {
    window.location.href = "index.html";
    return;
  }
  
  currentUser = user;
  
  // Load player's profile
  const playerRef = doc(db, "players", user.uid);
  const playerSnap = await getDoc(playerRef);
  
  if (!playerSnap.exists()) {
    alert("Please complete your profile first.");
    window.location.href = "edit-profile.html";
    return;
  }
  
  const player = playerSnap.data();
  
  document.getElementById("ign").value = player.ign;
  document.getElementById("ffuid").value = player.ffuid;
  document.getElementById("country").value = player.country;
  document.getElementById("phone").value = player.phone;
  
  // Check if already applied
  const regRef = doc(db, "registrations", user.uid);
  const regSnap = await getDoc(regRef);
  
  if (regSnap.exists()) {
    
    const reg = regSnap.data();
    
    alert("You already applied.\n\nStatus: " + reg.status);
    
    document.getElementById("applyBtn").disabled = true;
    document.getElementById("applyBtn").innerText =
      "Application Submitted";
    
  }
  
});

document.getElementById("applyBtn").addEventListener("click", async () => {
  
  if (!currentUser) return;
  
  const bkash = document.getElementById("bkashNumber").value.trim();
  const confirm = document.getElementById("confirm").checked;
  
  if (bkash === "") {
    alert("Please enter your bKash number.");
    return;
  }
  
  if (!confirm) {
    alert("Please confirm that you have sent the payment.");
    return;
  }
  
  const registration = {
    tournamentName: "Weekly Lite Tournament",
    playerUID: currentUser.uid,
    email: currentUser.email,
    
    ign: document.getElementById("ign").value,
    ffuid: document.getElementById("ffuid").value,
    country: document.getElementById("country").value,
    phone: document.getElementById("phone").value,
    
    bkashNumber: bkash,
    
    status: "Pending",
    
    createdAt: serverTimestamp()
  };
  
  await setDoc(
    doc(db, "registrations", currentUser.uid),
    registration
  );
  
  alert("✅ Application submitted!\n\nStatus: Pending Approval");
  
  location.reload();
  
});
import { auth, db } from "./firebase.js";

import {
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

import {
  doc,
  getDoc
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

onAuthStateChanged(auth, async (user) => {
  
  if (!user) {
    window.location.href = "index.html";
    return;
  }
  
  document.getElementById("welcome").innerHTML =
    "Welcome<br>" + user.email;
  
  // Check if user is an admin
  const adminRef = doc(db, "admins", user.uid);
  const adminSnap = await getDoc(adminRef);
  
  if (adminSnap.exists()) {
    
    const adminBtn = document.getElementById("adminBtn");
    
    adminBtn.style.display = "block";
    
    adminBtn.onclick = () => {
      window.location.href = "admin.html";
    };
    
  }
  
});

window.logout = function() {
  
  signOut(auth).then(() => {
    window.location.href = "index.html";
  });
  
};

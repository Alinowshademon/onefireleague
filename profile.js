import { auth, db } from "./firebase.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

onAuthStateChanged(auth, async (user) => {
  
  if (!user) {
    location.href = "index.html";
    return;
  }
  
  const docRef = doc(db, "players", user.uid);
  const docSnap = await getDoc(docRef);
  
  if (docSnap.exists()) {
    
    const data = docSnap.data();
    
    document.getElementById("playerName").textContent =
      data.ign || user.email;
    
    document.getElementById("ign").textContent =
      data.ign || "Not set";
    
    document.getElementById("ffuid").textContent =
      data.ffuid || "Not set";
    
    document.getElementById("country").textContent =
      data.country || "Not set";
    
    document.getElementById("phone").textContent =
      data.phone || "Not set";
    
  } else {
    
    document.getElementById("playerName").textContent =
      "Profile not found";
    
  }
  
});
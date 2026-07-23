import { auth, db } from "./firebase.js";
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

document.getElementById("loginBtn").addEventListener("click", async () => {
  
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;
  
  try {
    
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    const docRef = doc(db, "players", user.uid);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      window.location.href = "dashboard.html";
    } else {
      window.location.href = "Edit-profile.html";
    }
    
  } catch (error) {
    
    const errorBox = document.getElementById("errorMessage");
    
    if (errorBox) {
      errorBox.textContent = error.message;
    } else {
      console.error(error.message);
    }
    
  }
  
});
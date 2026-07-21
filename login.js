import { auth } from "./firebase.js";
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

document.getElementById("loginBtn").addEventListener("click", async () => {

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;

  try {

    await signInWithEmailAndPassword(auth, email, password);

    // Redirect without showing a popup
    window.location.href = "Edit-profile.html";
  } catch (error) {

    // Show the error on the page instead of a popup
    const errorBox = document.getElementById("errorMessage");
    if (errorBox) {
      errorBox.textContent = error.message;
    } else {
      console.error(error.message);
    }

  }

});

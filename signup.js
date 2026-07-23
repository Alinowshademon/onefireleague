import { auth } from "./firebase.js";
import { createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

document.getElementById("signupBtn").addEventListener("click", async () => {

  const email = document.getElementById("signupEmail").value.trim();
  const password = document.getElementById("signupPassword").value;

  try {

    await createUserWithEmailAndPassword(auth, email, password);

    alert("✅ Account created successfully!");

    window.location.href = "index.html";

  } catch (error) {

    alert(error.message);

  }

});
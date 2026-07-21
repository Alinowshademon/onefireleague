import { auth } from "./firebase.js";
import {
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

onAuthStateChanged(auth, (user) => {
  
  if (user) {
    document.getElementById("welcome").innerHTML =
      "Welcome<br>" + user.email;
  } else {
    window.location.href = "index.html";
  }
  
});

window.logout = function() {
  
  signOut(auth).then(() => {
    window.location.href = "index.html";
  });
  
};
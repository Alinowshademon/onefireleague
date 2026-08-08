import { auth, db } from "./firebase.js";
import { requestNotificationPermission } from "./firebase-messaging.js";

import {
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

import {
  doc,
  getDoc,
  setDoc
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

onAuthStateChanged(auth, async (user) => {

  if (!user) {
    window.location.href = "index.html";
    return;
  }

  const playerRef = doc(db, "players", user.uid);
const playerSnap = await getDoc(playerRef);

if (playerSnap.exists()) {

  const player = playerSnap.data();

  document.getElementById("welcome").innerHTML =
    "Welcome<br>" + (player.ign || "Player");

}

  // Request notification permission and save FCM token
  try {
    const token = await requestNotificationPermission();

    if (token) {
      await setDoc(
        doc(db, "players", user.uid),
        {
          fcmToken: token
        },
        { merge: true }
      );

      console.log("FCM token saved.");
    }
  } catch (err) {
    console.error("Notification setup failed:", err);
  }

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

window.logout = function () {

  signOut(auth).then(() => {
    window.location.href = "index.html";
  });

};
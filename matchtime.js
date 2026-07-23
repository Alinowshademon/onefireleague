import { auth, db } from "./firebase.js";

import {
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

import {
  doc,
  getDoc,
  getDocs,
  collection,
  onSnapshot
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

const statusCard =
document.getElementById("statusCard");

const statusTitle =
document.getElementById("statusTitle");

const statusMessage =
document.getElementById("statusMessage");

const matchContent =
document.getElementById("matchContent");

let activeTournamentId = null;

let activeTournament = null;

async function loadActiveTournament() {

  const snapshot = await getDocs(
    collection(db, "tournaments")
  );

  snapshot.forEach((tournament) => {

    const data = tournament.data();

    if (data.active) {

      activeTournamentId = tournament.id;

      activeTournament = data;

    }

  });

  if (!activeTournament) {

    statusCard.style.display = "block";

    matchContent.style.display = "none";

    statusTitle.innerText =
      "❌ No Active Tournament";

    statusMessage.innerText =
      "There is currently no active tournament.";

    return false;

  }

  return true;

}

onAuthStateChanged(auth, async (user) => {

  if (!user) {

    location.href = "index.html";

    return;

  }

  const tournamentLoaded =
    await loadActiveTournament();

  if (!tournamentLoaded)
    return;

  const registrationRef = doc(

    db,

    "registrations",

    `${activeTournamentId}_${user.uid}`

  );

  const registrationSnap =
    await getDoc(registrationRef);
      if (!registrationSnap.exists()) {

    statusCard.style.display = "block";

    matchContent.style.display = "none";

    statusTitle.innerText =
      "❌ Not Registered";

    statusMessage.innerHTML =
      "You are not registered for the active tournament.<br><br>Please register first to access the match room details.";

    return;

  }

  const registration =
    registrationSnap.data();

  if (registration.status === "Pending") {

    statusCard.style.display = "block";

    matchContent.style.display = "none";

    statusTitle.innerText =
      "🟡 Registration Pending";

    statusMessage.innerHTML =
      "Your registration is waiting for approval.<br><br>Room ID and Password will appear here after the tournament organizer approves your registration.";

    return;

  }

  if (registration.status === "Rejected") {

    statusCard.style.display = "block";

    matchContent.style.display = "none";

    statusTitle.innerText =
      "🔴 Registration Rejected";

    statusMessage.innerHTML =
      "Unfortunately your registration was rejected.<br><br>Please contact the tournament organizer if you believe this was a mistake.";

    return;

  }

  // Registration Approved

  statusCard.style.display = "none";

  matchContent.style.display = "block";
    // ===========================
  // MATCH 1
  // ===========================

  const match1Ref =
    doc(db, "matches", "match1");

  onSnapshot(match1Ref, (snapshot) => {

    if (!snapshot.exists()) return;

    const data = snapshot.data();

    document.getElementById("date1").innerText =
      data.date || "Not Set";

    document.getElementById("time1").innerText =
      data.time || "Not Set";

    document.getElementById("map1").innerText =
      data.map || "Not Set";

    document.getElementById("roomId1").innerText =
      data.roomId || "*******";

    document.getElementById("roomPass1").innerText =
      data.password || "***";

  });

  // ===========================
  // MATCH 2
  // ===========================

  const match2Ref =
    doc(db, "matches", "match2");

  onSnapshot(match2Ref, (snapshot) => {

    if (!snapshot.exists()) return;

    const data = snapshot.data();

    document.getElementById("date2").innerText =
      data.date || "Not Set";

    document.getElementById("time2").innerText =
      data.time || "Not Set";

    document.getElementById("map2").innerText =
      data.map || "Not Set";

    document.getElementById("roomId2").innerText =
      data.roomId || "*******";

    document.getElementById("roomPass2").innerText =
      data.password || "***";

  });
});

window.copyText = function(id) {

  const text =
    document.getElementById(id).innerText;

  navigator.clipboard.writeText(text)

    .then(() => {

      // Optional:
      // alert("Copied!");

    })

    .catch((err) => {

      console.error("Copy failed:", err);

    });

};
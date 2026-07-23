import { auth, db } from "./firebase.js";

import {
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

import {
  doc,
  getDoc,
  getDocs,
  setDoc,
  serverTimestamp,
  collection
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

let currentUser = null;

let tournamentId = null;

let tournamentData = null;

const registrationForm =
document.getElementById("registrationForm");

const statusCard =
document.getElementById("statusCard");

const statusTitle =
document.getElementById("statusTitle");

const statusValue =
document.getElementById("statusValue");

const statusMessage =
document.getElementById("statusMessage");

const savedBkash =
document.getElementById("savedBkash");

const savedTeam =
document.getElementById("savedTeam");

async function loadActiveTournament() {

  const snapshot = await getDocs(
    collection(db, "tournaments")
  );

  snapshot.forEach((tournament) => {

    const data = tournament.data();

    if (data.active) {

      tournamentId = tournament.id;

      tournamentData = data;

    }

  });

  if (!tournamentData) {

    alert("No active tournament found.");

    location.href = "dashboard.html";

    return;

  }

  document.getElementById("tournamentName").textContent =
    "🔥 " + tournamentData.name + " 🔥";

  document.getElementById("tournamentDate").textContent =
    tournamentData.date;

  document.getElementById("tournamentTime").textContent =
    tournamentData.time;

  document.getElementById("tournamentMap").textContent =
    tournamentData.map;

  document.getElementById("tournamentMode").textContent =
    tournamentData.mode;
// ===============================
// UPDATE PLAYER LABELS
// ===============================

const player2Title =
document.getElementById("player2Title");

if (tournamentData.mode === "Solo") {

  document.getElementById("teamName").placeholder =
    "👤 Player Name";

}

else if (tournamentData.mode === "Duo") {

  player2Title.textContent =
    "👥 Player 2";

}

else if (tournamentData.mode === "Squad") {

  player2Title.textContent =
    "👥 Player 2";

}
  document.getElementById("tournamentFee").textContent =
    tournamentData.fee;

  document.getElementById("paymentNumber").textContent =
    tournamentData.paymentNumber;
// ===============================
// SHOW PLAYERS BASED ON MODE
// ===============================

const player2Section =
  document.getElementById("player2Section");

const player3Section =
  document.getElementById("player3Section");

const player4Section =
  document.getElementById("player4Section");

const player5Section =
  document.getElementById("player5Section");

if (tournamentData.mode === "Solo") {
  
  player2Section.style.display = "none";
  player3Section.style.display = "none";
  player4Section.style.display = "none";
  player5Section.style.display = "none";
  
}

else if (tournamentData.mode === "Duo") {
  
  player2Section.style.display = "block";
  player3Section.style.display = "none";
  player4Section.style.display = "none";
  player5Section.style.display = "none";
  
}

else if (tournamentData.mode === "Squad") {
  
  player2Section.style.display = "block";
  player3Section.style.display = "block";
  player4Section.style.display = "block";
  player5Section.style.display = "block";
  
}
}

onAuthStateChanged(auth, async (user) => {

  if (!user) {

    location.href = "index.html";

    return;

  }

  currentUser = user;

  await loadActiveTournament();

  const playerRef =
  doc(db, "players", user.uid);

  const playerSnap =
  await getDoc(playerRef);

  if (!playerSnap.exists()) {

    alert("Please complete your profile first.");

    location.href = "edit-profile.html";

    return;

  }

  const player = playerSnap.data();

  document.getElementById("ign").value =
    player.ign || "";

  document.getElementById("ffuid").value =
    player.ffuid || "";

  document.getElementById("country").value =
    player.country || "";

  document.getElementById("phone").value =
    player.phone || "";

  const regRef = doc(

    db,

    "registrations",

    `${tournamentId}_${user.uid}`

  );

  const regSnap =
  await getDoc(regRef);
    if (regSnap.exists()) {

    const reg = regSnap.data();

    registrationForm.style.display = "none";

    statusCard.style.display = "block";

    savedTeam.textContent =
      reg.teamName || "-";

    savedBkash.textContent =
      reg.bkashNumber || "-";

    switch (reg.status) {

      case "Approved":

        statusTitle.textContent =
          "🎉 Registration Approved";

        statusValue.textContent =
          "🟢 Approved";

        statusMessage.textContent =
          "Congratulations! Your team has been approved for this tournament.";

        break;

      case "Rejected":

        statusTitle.textContent =
          "❌ Registration Rejected";

        statusValue.textContent =
          "🔴 Rejected";

        statusMessage.textContent =
          "Unfortunately your application was rejected. Please contact the tournament organizer.";

        break;

      default:

        statusTitle.textContent =
          "✅ Team Registered";

        statusValue.textContent =
          "🟡 Pending Approval";

        statusMessage.textContent =
          "Your team registration has been received and is waiting for approval.";

    }

  }

});

document.getElementById("applyBtn").addEventListener(

  "click",

  async () => {

    if (!currentUser) return;

    const teamName =
      document.getElementById("teamName").value.trim();

    const partnerIgn =
  document.getElementById("partnerIgn").value.trim();

const partnerUid =
  document.getElementById("partnerUid").value.trim();

const player3Ign =
  document.getElementById("player3Ign").value.trim();

const player3Uid =
  document.getElementById("player3Uid").value.trim();

const player4Ign =
  document.getElementById("player4Ign").value.trim();

const player4Uid =
  document.getElementById("player4Uid").value.trim();

const player5Ign =
  document.getElementById("player5Ign").value.trim();

const player5Uid =
  document.getElementById("player5Uid").value.trim();

    const bkash =
      document.getElementById("bkashNumber").value.trim();

    const confirm =
      document.getElementById("confirm").checked;

    if (teamName === "") {

      alert("Please enter your Team Name.");

      return;

    }

    // ===============================
// MODE-BASED PLAYER VALIDATION
// ===============================

if (tournamentData.mode === "Duo" ||
  tournamentData.mode === "Squad") {
  
  if (partnerIgn === "") {
    
    alert("Please enter Player 2 IGN.");
    
    return;
    
  }
  
  if (partnerUid === "") {
    
    alert("Please enter Player 2 UID.");
    
    return;
    
  }
  
}

if (tournamentData.mode === "Squad") {
  
  if (player3Ign === "") {
    
    alert("Please enter Player 3 IGN.");
    
    return;
    
  }
  
  if (player3Uid === "") {
    
    alert("Please enter Player 3 UID.");
    
    return;
    
  }
  
  if (player4Ign === "") {
    
    alert("Please enter Player 4 IGN.");
    
    return;
    
  }
  
  if (player4Uid === "") {
    
    alert("Please enter Player 4 UID.");
    
    return;
    
  }
  
  if (player5Ign === "") {
    
    alert("Please enter Player 5 IGN.");
    
    return;
    
  }
  
  if (player5Uid === "") {
    
    alert("Please enter Player 5 UID.");
    
    return;
    
  }
  
}

    if (bkash === "") {

      alert("Please enter your bKash number.");

      return;

    }

    if (!confirm) {

      alert("Please confirm that you have sent the registration fee.");

      return;

    }
        const registration = {

      tournamentId: tournamentId,

      tournamentName: tournamentData.name,

      playerUID: currentUser.uid,

      email: currentUser.email,

      teamName: teamName,

      leaderIGN:
        document.getElementById("ign").value,

      leaderUID:
        document.getElementById("ffuid").value,

      partnerIGN: partnerIgn,
  
  partnerUID: partnerUid,
  
  player3IGN: player3Ign,
  
  player3UID: player3Uid,
  
  player4IGN: player4Ign,
  
  player4UID: player4Uid,
  
  player5IGN: player5Ign,
  
  player5UID: player5Uid,
      country:
        document.getElementById("country").value,

      phone:
        document.getElementById("phone").value,

      bkashNumber: bkash,

      mode: tournamentData.mode,

      map: tournamentData.map,

      fee: tournamentData.fee,

      status: "Pending",

      createdAt: serverTimestamp()

    };

    await setDoc(

      doc(

        db,

        "registrations",

        `${tournamentId}_${currentUser.uid}`

      ),

      registration

    );
        alert("Tournament registration submitted successfully!");

    location.reload();

  }

);

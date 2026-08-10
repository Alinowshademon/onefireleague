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


/* ===============================
   ELEMENTS
================================ */

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

const registrationCount =
  document.getElementById("registrationCount");

const progressFill =
  document.getElementById("progressFill");

const registrationClosed =
  document.getElementById("registrationClosed");


/* ===============================
   LOAD SELECTED TOURNAMENT
================================ */

async function loadSelectedTournament() {

  const params =
    new URLSearchParams(
      window.location.search
    );

  tournamentId =
    params.get("tournament");


  if (!tournamentId) {

    alert("No tournament selected.");

    location.href =
      "tournament-list.html";

    return false;

  }


  const tournamentRef =
    doc(
      db,
      "tournaments",
      tournamentId
    );


  const tournamentSnap =
    await getDoc(tournamentRef);


  if (!tournamentSnap.exists()) {

    alert("Tournament not found.");

    location.href =
      "tournament-list.html";

    return false;

  }


  tournamentData =
    tournamentSnap.data();


  /*
    Only tournaments marked active
    can be registered for.
  */

  if (!tournamentData.active) {

    alert(
      "This tournament is no longer available."
    );

    location.href =
      "tournament-list.html";

    return false;

  }


  return true;

}
/* ===============================
   DISPLAY TOURNAMENT DETAILS
================================ */

function displayTournamentDetails() {

  document.getElementById(
    "tournamentName"
  ).textContent =
    "🔥 " +
    tournamentData.name +
    " 🔥";


  document.getElementById(
    "tournamentDate"
  ).textContent =
    tournamentData.date || "-";


  document.getElementById(
    "tournamentTime"
  ).textContent =
    tournamentData.time || "-";


  document.getElementById(
    "tournamentMap"
  ).textContent =
    tournamentData.map || "-";


  document.getElementById(
    "tournamentMode"
  ).textContent =
    tournamentData.mode || "-";


  document.getElementById(
    "tournamentFee"
  ).textContent =
    tournamentData.fee || "0";


  document.getElementById(
    "firstPrizeText"
  ).textContent =
    tournamentData.firstPrize || "-";


  document.getElementById(
    "secondPrizeText"
  ).textContent =
    tournamentData.secondPrize || "-";


  document.getElementById(
    "thirdPrizeText"
  ).textContent =
    tournamentData.thirdPrize || "-";


  document.getElementById(
    "paymentNumber"
  ).textContent =
    tournamentData.paymentNumber || "-";
}


/* ===============================
   PLAYER LABELS & MODE
================================ */

function setupPlayerSections() {

  const player2Title =
    document.getElementById(
      "player2Title"
    );


  const player2Section =
    document.getElementById(
      "player2Section"
    );

  const player3Section =
    document.getElementById(
      "player3Section"
    );

  const player4Section =
    document.getElementById(
      "player4Section"
    );

  const player5Section =
    document.getElementById(
      "player5Section"
    );


  /*
    Hide everything first.
    Then show only what the
    selected tournament needs.
  */

  player2Section.style.display =
    "none";

  player3Section.style.display =
    "none";

  player4Section.style.display =
    "none";

  player5Section.style.display =
    "none";


  /* ===============================
     SOLO
  ================================ */

  if (
    tournamentData.mode === "Solo"
  ) {

    document.getElementById(
      "teamName"
    ).placeholder =
      "👤 Player Name";

  }


  /* ===============================
     DUO
  ================================ */

  else if (
    tournamentData.mode === "Duo"
  ) {

    player2Title.textContent =
      "👥 Player 2";

    player2Section.style.display =
      "block";

  }


  /* ===============================
     SQUAD
  ================================ */

  else if (
    tournamentData.mode === "Squad"
  ) {

    player2Title.textContent =
      "👥 Player 2";

    player2Section.style.display =
      "block";

    player3Section.style.display =
      "block";

    player4Section.style.display =
      "block";

    player5Section.style.display =
      "block";

  }

}


/* ===============================
   LOAD TOURNAMENT
================================ */

async function initializeTournament() {

  const loaded =
    await loadSelectedTournament();


  if (!loaded) {
    return false;
  }


  displayTournamentDetails();

  setupPlayerSections();


  return true;

}
/* ===============================
   UPDATE REGISTRATION PROGRESS
================================ */

async function updateRegistrationProgress() {

  const snapshot =
    await getDocs(
      collection(
        db,
        "registrations"
      )
    );


  let approved = 0;

  let occupied = 0;


  snapshot.forEach((registration) => {

    const data =
      registration.data();


    /*
      Ignore registrations from
      other tournaments.
    */

    if (
      data.tournamentId !==
      tournamentId
    ) {

      return;

    }


    /*
      Rejected registrations do NOT
      occupy a slot.
    */

    if (
      data.status !==
      "Rejected"
    ) {

      occupied++;

    }


    /*
      Only approved teams are shown
      in the main Registered counter.
    */

    if (
      data.status ===
      "Approved"
    ) {

      approved++;

    }

  });


  const maxTeams =
    Number(
      tournamentData.maxTeams
    ) || 0;


  /* ===============================
     APPROVED REGISTERED COUNT
  ================================ */

  const registeredCount =
    document.getElementById(
      "registeredCount"
    );

  const maxSlots =
    document.getElementById(
      "maxSlots"
    );

  const slotBar =
    document.getElementById(
      "slotBar"
    );


  if (registeredCount) {

    registeredCount.textContent =
      approved;

  }


  if (maxSlots) {

    maxSlots.textContent =
      maxTeams;

  }


  /* ===============================
     APPROVED SLOT BAR
  ================================ */

  const approvedPercent =
    maxTeams > 0
      ? Math.min(
          (approved / maxTeams) * 100,
          100
        )
      : 0;


  if (slotBar) {

    slotBar.style.width =
      approvedPercent + "%";

  }


  /* ===============================
     OCCUPIED REGISTRATION COUNT
  ================================ */

  registrationCount.textContent =
    `${occupied} / ${maxTeams} Teams`;


  const occupiedPercent =
    maxTeams > 0
      ? Math.min(
          (occupied / maxTeams) * 100,
          100
        )
      : 0;


  progressFill.style.width =
    occupiedPercent + "%";


  /* ===============================
     PROGRESS BAR COLOR
  ================================ */

  if (
    occupiedPercent >= 100
  ) {

    progressFill.style.background =
      "#ea5455";

  }

  else if (
    occupiedPercent >= 70
  ) {

    progressFill.style.background =
      "#ffd633";

  }

  else {

    progressFill.style.background =
      "#28c76f";

  }


  /* ===============================
     CLOSE REGISTRATION
  ================================ */

  if (
    maxTeams > 0 &&
    occupied >= maxTeams
  ) {

    registrationClosed.style.display =
      "block";

    registrationForm.style.display =
      "none";

  }

  else {

    registrationClosed.style.display =
      "none";

  }

}


/* ===============================
   LOAD PLAYER PROFILE
================================ */

async function loadPlayerProfile(user) {

  const playerRef =
    doc(
      db,
      "players",
      user.uid
    );


  const playerSnap =
    await getDoc(playerRef);


  if (!playerSnap.exists()) {

    alert(
      "Please complete your profile first."
    );

    location.href =
      "edit-profile.html";

    return false;

  }


  const player =
    playerSnap.data();


  document.getElementById(
    "ign"
  ).value =
    player.ign || "";


  document.getElementById(
    "ffuid"
  ).value =
    player.ffuid || "";


  document.getElementById(
    "country"
  ).value =
    player.country || "";


  document.getElementById(
    "phone"
  ).value =
    player.phone || "";


  return true;

}
/* ===============================
   CHECK EXISTING REGISTRATION
================================ */

async function checkExistingRegistration(user) {

  const regRef =
    doc(
      db,
      "registrations",
      `${tournamentId}_${user.uid}`
    );


  const regSnap =
    await getDoc(regRef);


  if (!regSnap.exists()) {

    return;

  }


  const reg =
    regSnap.data();


  /*
    If the previous registration was
    rejected, allow the player to
    register again.
  */

  if (
    reg.status === "Rejected"
  ) {

    registrationForm.style.display =
      "block";

    statusCard.style.display =
      "none";

    return;

  }


  /* ===============================
     EXISTING APPROVED/PENDING
  ================================ */

  registrationForm.style.display =
    "none";

  statusCard.style.display =
    "block";


  savedTeam.textContent =
    reg.teamName || "-";


  savedBkash.textContent =
    reg.bkashNumber || "-";


  switch (reg.status) {


    /* =============================
       APPROVED
    ============================== */

    case "Approved":

      statusTitle.textContent =
        "🎉 Registration Approved";


      statusValue.textContent =
        "🟢 Approved";


      statusMessage.textContent =
        "Congratulations! Your team has been approved for this tournament.";


      break;


    /* =============================
       PENDING
    ============================== */

    case "Pending":

      statusTitle.textContent =
        "✅ Team Registered";


      statusValue.textContent =
        "🟡 Pending Approval";


      statusMessage.textContent =
        "Your team registration has been received and is waiting for approval. For match information including 'Room ID PASS' go to 📅 Match times.";


      break;


    /* =============================
       OTHER STATUS
    ============================== */

    default:

      statusTitle.textContent =
        "✅ Team Registered";


      statusValue.textContent =
        "🟡 Pending Approval";


      statusMessage.textContent =
        "Your team registration has been received and is waiting for approval.";

  }

}


/* ===============================
   AUTHENTICATION
================================ */

onAuthStateChanged(
  auth,
  async (user) => {

    if (!user) {

      location.href =
        "index.html";

      return;

    }


    currentUser =
      user;


    /* =============================
       LOAD SELECTED TOURNAMENT
    ============================== */

    const initialized =
      await initializeTournament();


    if (!initialized) {

      return;

    }


    /* =============================
       UPDATE SLOTS
    ============================== */

    await updateRegistrationProgress();


    /* =============================
       LOAD PLAYER PROFILE
    ============================== */

    const profileLoaded =
      await loadPlayerProfile(user);


    if (!profileLoaded) {

      return;

    }


    /* =============================
       CHECK EXISTING REGISTRATION
    ============================== */

    await checkExistingRegistration(
      user
    );

  }
);
/* ===============================
   SUBMIT REGISTRATION
================================ */

document
  .getElementById("applyBtn")
  .addEventListener(
    "click",
    async () => {

      if (!currentUser) {
        return;
      }


      /* =============================
         GET FORM VALUES
      ============================== */

      const teamName =
        document
          .getElementById("teamName")
          .value
          .trim();


      const partnerIgn =
        document
          .getElementById("partnerIgn")
          .value
          .trim();


      const partnerUid =
        document
          .getElementById("partnerUid")
          .value
          .trim();


      const player3Ign =
        document
          .getElementById("player3Ign")
          .value
          .trim();


      const player3Uid =
        document
          .getElementById("player3Uid")
          .value
          .trim();


      const player4Ign =
        document
          .getElementById("player4Ign")
          .value
          .trim();


      const player4Uid =
        document
          .getElementById("player4Uid")
          .value
          .trim();


      const player5Ign =
        document
          .getElementById("player5Ign")
          .value
          .trim();


      const player5Uid =
        document
          .getElementById("player5Uid")
          .value
          .trim();


      const bkash =
        document
          .getElementById("bkashNumber")
          .value
          .trim();


      const confirmed =
        document
          .getElementById("confirm")
          .checked;


      /* =============================
         BASIC VALIDATION
      ============================== */

      if (teamName === "") {

        alert(
          "Please enter your Team Name."
        );

        return;

      }


      /* =============================
         DUO / SQUAD VALIDATION
      ============================== */

      if (
        tournamentData.mode === "Duo" ||
        tournamentData.mode === "Squad"
      ) {

        if (partnerIgn === "") {

          alert(
            "Please enter Player 2 IGN."
          );

          return;

        }


        if (partnerUid === "") {

          alert(
            "Please enter Player 2 UID."
          );

          return;

        }

      }


      /* =============================
         SQUAD VALIDATION
      ============================== */

      if (
        tournamentData.mode === "Squad"
      ) {

        if (player3Ign === "") {

          alert(
            "Please enter Player 3 IGN."
          );

          return;

        }


        if (player3Uid === "") {

          alert(
            "Please enter Player 3 UID."
          );

          return;

        }


        if (player4Ign === "") {

          alert(
            "Please enter Player 4 IGN."
          );

          return;

        }


        if (player4Uid === "") {

          alert(
            "Please enter Player 4 UID."
          );

          return;

        }


        if (player5Ign === "") {

          alert(
            "Please enter Player 5 IGN."
          );

          return;

        }


        if (player5Uid === "") {

          alert(
            "Please enter Player 5 UID."
          );

          return;

        }

      }


      /* =============================
         PAYMENT VALIDATION
      ============================== */

      if (bkash === "") {

        alert(
          "Please enter your bKash number."
        );

        return;

      }


      if (!confirmed) {

        alert(
          "Please confirm that you have sent the registration fee."
        );

        return;

      }


      /* =============================
         CHECK AVAILABLE SLOTS
      ============================== */

      const snapshot =
        await getDocs(
          collection(
            db,
            "registrations"
          )
        );


      let occupiedSlots = 0;


      snapshot.forEach(
        (registration) => {

          const data =
            registration.data();


          if (
            data.tournamentId ===
              tournamentId &&
            data.status !==
              "Rejected"
          ) {

            occupiedSlots++;

          }

        }
      );


      const maxTeams =
        Number(
          tournamentData.maxTeams
        ) || 0;


      /* =============================
         TOURNAMENT FULL
      ============================== */

      if (
        maxTeams > 0 &&
        occupiedSlots >= maxTeams
      ) {

        alert(
          "Registration is closed. Tournament is full."
        );

        return;

      }


      /* =============================
         CREATE REGISTRATION
      ============================== */

      const registration = {

        tournamentId:
          tournamentId,

        tournamentName:
          tournamentData.name,

        playerUID:
          currentUser.uid,

        email:
          currentUser.email,

        teamName:
          teamName,

        leaderIGN:
          document
            .getElementById("ign")
            .value,

        leaderUID:
          document
            .getElementById("ffuid")
            .value,

        partnerIGN:
          partnerIgn,

        partnerUID:
          partnerUid,

        player3IGN:
          player3Ign,

        player3UID:
          player3Uid,

        player4IGN:
          player4Ign,

        player4UID:
          player4Uid,

        player5IGN:
          player5Ign,

        player5UID:
          player5Uid,

        country:
          document
            .getElementById("country")
            .value,

        phone:
          document
            .getElementById("phone")
            .value,

        bkashNumber:
          bkash,

        mode:
          tournamentData.mode,

        map:
          tournamentData.map,

        fee:
          tournamentData.fee,

        status:
          "Pending",

        createdAt:
          serverTimestamp()

      };


      /* =============================
         SAVE REGISTRATION
      ============================== */

      await setDoc(

        doc(
          db,
          "registrations",
          `${tournamentId}_${currentUser.uid}`
        ),

        registration

      );


      alert(
        "Tournament registration submitted successfully!"
      );


      location.reload();

    }
  );
 
import { auth, db } from "./firebase.js";

import {
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

import {
  doc,
  getDoc,
  setDoc,
  getDocs,
  deleteDoc,
  collection,
  updateDoc
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";


/* ===============================
   FORM ELEMENTS
================================ */

const nameInput =
  document.getElementById("name");

const modeInput =
  document.getElementById("mode");

const mapInput =
  document.getElementById("map");

const dateInput =
  document.getElementById("date");

const timeInput =
  document.getElementById("time");

const feeInput =
  document.getElementById("fee");

const paymentInput =
  document.getElementById("payment");

const maxTeams =
  document.getElementById("maxTeams");

const firstPrizeInput =
  document.getElementById("firstPrize");

const secondPrizeInput =
  document.getElementById("secondPrize");

const thirdPrizeInput =
  document.getElementById("thirdPrize");

const registrationOpen =
  document.getElementById("registrationOpen");

const activeTournament =
  document.getElementById("activeTournament");

const saveBtn =
  document.getElementById("saveBtn");

const newBtn =
  document.getElementById("newBtn");

const deleteBtn =
  document.getElementById("deleteBtn");

const tournamentList =
  document.getElementById("tournamentList");


let editingId = null;


/* ===============================
   ADMIN AUTHENTICATION
================================ */

onAuthStateChanged(auth, async (user) => {

  if (!user) {

    location.href = "index.html";

    return;

  }


  const adminSnap =
    await getDoc(
      doc(db, "admins", user.uid)
    );


  if (!adminSnap.exists()) {

    alert("Access denied.");

    location.href =
      "dashboard.html";

    return;

  }


  loadTournaments();

});
async function loadTournaments() {

  tournamentList.innerHTML = "";

  const snapshot = await getDocs(
    collection(db, "tournaments")
  );

  if (snapshot.empty) {

    tournamentList.innerHTML = `
      <div class="tournament-item">
        <h3>No tournaments found.</h3>
        <p>Create your first tournament.</p>
      </div>
    `;

    return;
  }

  snapshot.forEach((tournament) => {

    const data = tournament.data();

    const item =
      document.createElement("div");

    item.className =
      "tournament-item";

    item.innerHTML = `

      <h3>🏆 ${data.name || "Unnamed Tournament"}</h3>

      <p>🎮 ${data.mode || "-"}</p>

      <p>🗺 ${data.map || "-"}</p>

      <p>📅 ${data.date || "-"}</p>

      <p>🕒 ${data.time || "-"}</p>

      <p>
        💰 Fee:
        ${data.fee ?? 0}
      </p>

      <p>
        👥 Maximum Teams:
        ${data.maxTeams || 0}
      </p>

      ${
        data.registrationOpen
          ? `
            <div class="active-badge">
              🟢 Registration Open
            </div>
          `
          : `
            <div class="active-badge">
              🔴 Registration Closed
            </div>
          `
      }

      ${
        data.active
          ? `
            <div class="active-badge">
              ⭐ Active Tournament
            </div>
          `
          : ""
      }

    `;

    item.onclick = () => {

      editingId =
        tournament.id;

      nameInput.value =
        data.name || "";

      modeInput.value =
        data.mode || "Solo";

      mapInput.value =
        data.map || "Bermuda";

      dateInput.value =
        data.date || "";

      timeInput.value =
        data.time || "";

      feeInput.value =
        data.fee ?? "";

      firstPrizeInput.value =
        data.firstPrize || "";

      secondPrizeInput.value =
        data.secondPrize || "";

      thirdPrizeInput.value =
        data.thirdPrize || "";

      paymentInput.value =
        data.paymentNumber || "";

      maxTeams.value =
        data.maxTeams ?? "";

      registrationOpen.checked =
        data.registrationOpen ?? true;

      activeTournament.checked =
        data.active ?? false;

    };

    tournamentList.appendChild(item);

  });

}

/* ===============================
   SAVE TOURNAMENT
================================ */

saveBtn.onclick = async () => {

  if (
    nameInput.value.trim() === ""
  ) {

    alert(
      "Please enter a tournament name."
    );

    return;

  }


  let tournamentId =
    editingId;


  /* ===============================
     CREATE NEW TOURNAMENT ID
  ================================ */

  if (!tournamentId) {

    tournamentId =
      nameInput.value
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");

  }




  /* ===============================
     TOURNAMENT DATA
  ================================ */

  const tournamentData = {

    name:
      nameInput.value.trim(),

    mode:
      modeInput.value,

    map:
      mapInput.value,

    date:
      dateInput.value,

    time:
      timeInput.value,

    fee:
      Number(feeInput.value) || 0,

    firstPrize:
      firstPrizeInput.value.trim(),

    secondPrize:
      secondPrizeInput.value.trim(),

    thirdPrize:
      thirdPrizeInput.value.trim(),

    paymentNumber:
      paymentInput.value.trim(),

    maxTeams:
      Number(maxTeams.value) || 0,

    registrationOpen:
      registrationOpen.checked,

    active:
      activeTournament.checked

  };


  /* ===============================
     SAVE TO FIRESTORE
  ================================ */

  await setDoc(

    doc(
      db,
      "tournaments",
      tournamentId
    ),

    tournamentData,

    {
      merge: true
    }

  );


  alert(
    "Tournament saved successfully!"
  );


  editingId =
    tournamentId;


  await loadTournaments();

};

/* ===============================
   NEW TOURNAMENT
================================ */

newBtn.onclick = () => {

  editingId = null;

  nameInput.value = "";

  modeInput.value = "Solo";

  mapInput.value = "Bermuda";

  dateInput.value = "";

  timeInput.value = "";

  feeInput.value = "";

  firstPrizeInput.value = "";

  secondPrizeInput.value = "";

  thirdPrizeInput.value = "";

  paymentInput.value = "";

  maxTeams.value = "";

  registrationOpen.checked = true;

  activeTournament.checked = false;

};


/* ===============================
   DELETE TOURNAMENT
================================ */

deleteBtn.onclick = async () => {

  if (!editingId) {

    alert(
      "Please select a tournament first."
    );

    return;

  }


  const confirmed =
    confirm(
      "Delete this tournament?"
    );


  if (!confirmed) {

    return;

  }


  await deleteDoc(

    doc(
      db,
      "tournaments",
      editingId
    )

  );


  editingId = null;


  /* ===============================
     CLEAR FORM
  ================================ */

  nameInput.value = "";

  modeInput.value = "Solo";

  mapInput.value = "Bermuda";

  dateInput.value = "";

  timeInput.value = "";

  feeInput.value = "";

  firstPrizeInput.value = "";

  secondPrizeInput.value = "";

  thirdPrizeInput.value = "";

  paymentInput.value = "";

  maxTeams.value = "";

  registrationOpen.checked = true;

  activeTournament.checked = false;


  alert(
    "Tournament deleted."
  );


  await loadTournaments();

};


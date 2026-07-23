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

const firstPrize =
  document.getElementById("firstPrize");

const secondPrize =
  document.getElementById("secondPrize");

const thirdPrize =
  document.getElementById("thirdPrize");

const paymentInput =
  document.getElementById("payment");
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
    
    location.href = "dashboard.html";
    
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

    const item = document.createElement("div");

    item.className = "tournament-item";

    item.innerHTML = `

      <h3>🏆 ${data.name}</h3>

      <p>🎮 ${data.mode}</p>

      <p>🗺 ${data.map}</p>

      <p>📅 ${data.date}</p>

      <p>🕒 ${data.time}</p>

      ${
        data.active
          ? '<div class="active-badge">⭐ Active Tournament</div>'
          : ""
      }

    `;

    item.onclick = () => {

      editingId = tournament.id;

      nameInput.value = data.name || "";

      modeInput.value = data.mode || "Solo";

      mapInput.value = data.map || "Bermuda";

      dateInput.value = data.date || "";

      timeInput.value = data.time || "";

      feeInput.value = data.fee || "";

firstPrizeInput.value =
  data.firstPrize || "";

secondPrizeInput.value =
  data.secondPrize || "";

thirdPrizeInput.value =
  data.thirdPrize || "";
  
paymentInput.value =
  data.paymentNumber || "";

      registrationOpen.checked =
        data.registrationOpen || false;

      activeTournament.checked =
        data.active || false;

    };

    tournamentList.appendChild(item);

  });

}
saveBtn.onclick = async () => {

  if (nameInput.value.trim() === "") {

    alert("Please enter a tournament name.");

    return;

  }

  let tournamentId = editingId;

  if (!tournamentId) {

    tournamentId =

      nameInput.value
        .trim()
        .toLowerCase()
        .replace(/\s+/g, "-");

  }

  // Only one tournament can be active
  if (activeTournament.checked) {

    const snapshot = await getDocs(
      collection(db, "tournaments")
    );

    for (const tournament of snapshot.docs) {

      await updateDoc(

        doc(db, "tournaments", tournament.id),

        {

          active: false

        }

      );

    }

  }

  await setDoc(

    doc(db, "tournaments", tournamentId),

    {

      name: nameInput.value,

      mode: modeInput.value,

      map: mapInput.value,

      date: dateInput.value,

      time: timeInput.value,

      fee: Number(feeInput.value),
  
  firstPrize: firstPrize.value,
  
  secondPrize: secondPrize.value,
  
  thirdPrize: thirdPrize.value,
  
  paymentNumber: paymentInput.value,
  
  firstPrize: firstPrizeInput.value,
  
  secondPrize: secondPrizeInput.value,
  
  thirdPrize: thirdPrizeInput.value,
  
  registrationOpen:
  registrationOpen.checked,
  
      active:
        activeTournament.checked

    }

  );

  alert("Tournament saved successfully!");

  editingId = null;

  loadTournaments();

};
newBtn.onclick = () => {

  editingId = null;

  nameInput.value = "";

  modeInput.value = "Solo";

  mapInput.value = "Bermuda";

  dateInput.value = "";

  timeInput.value = "";

  feeInput.value = "";

firstPrize.value = "";

secondPrize.value = "";

thirdPrize.value = "";

paymentInput.value = "";

  registrationOpen.checked = true;

  activeTournament.checked = false;

};


deleteBtn.onclick = async () => {

  if (!editingId) {

    alert("Please select a tournament first.");

    return;

  }

  if (!confirm("Delete this tournament?")) {

    return;

  }

  await deleteDoc(

    doc(db, "tournaments", editingId)

  );

  editingId = null;

  nameInput.value = "";

  modeInput.value = "Solo";

  mapInput.value = "Bermuda";

  dateInput.value = "";

  timeInput.value = "";

  feeInput.value = "";

firstPrize.value = "";

secondPrize.value = "";

thirdPrize.value = "";

paymentInput.value = "";

  registrationOpen.checked = true;

  activeTournament.checked = false;

  alert("Tournament deleted.");

  loadTournaments();

};

import { auth, db } from "./firebase.js";

import {
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

import {
  collection,
  getDocs
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";


const tournamentList =
  document.getElementById("tournamentList");


/* ===============================
   LOAD ACTIVE TOURNAMENTS
================================ */

async function loadTournaments() {

  tournamentList.innerHTML = `
    <div class="loading">
      Loading tournaments...
    </div>
  `;

  try {

    /* ===============================
       GET TOURNAMENTS
    ================================ */

    const tournamentSnapshot =
      await getDocs(
        collection(db, "tournaments")
      );


    /* ===============================
       GET REGISTRATIONS
    ================================ */

    const registrationSnapshot =
      await getDocs(
        collection(db, "registrations")
      );


    /* ===============================
       COUNT APPROVED TEAMS
    ================================ */

    const approvedCounts = {};


    registrationSnapshot.forEach((registration) => {

      const data = registration.data();

      if (
        data.status === "Approved" &&
        data.tournamentId
      ) {

        if (!approvedCounts[data.tournamentId]) {

          approvedCounts[data.tournamentId] = 0;

        }

        approvedCounts[data.tournamentId]++;

      }

    });


    /* ===============================
       CLEAR LIST
    ================================ */

    tournamentList.innerHTML = "";


    let activeFound = false;


    /* ===============================
       CREATE TOURNAMENT CARDS
    ================================ */

    tournamentSnapshot.forEach((tournament) => {

      const data = tournament.data();


      /* Only show active tournaments */

      if (!data.active) {

        return;

      }


      activeFound = true;


      const tournamentId =
        tournament.id;


      const approved =
        approvedCounts[tournamentId] || 0;


      const maxTeams =
        Number(data.maxTeams) || 0;


      const card =
        document.createElement("div");


      card.className =
        "tournament-card";


      card.innerHTML = `

        <h3>
          🔥 ${data.name || "Tournament"}
        </h3>

        <div class="tournament-info">

          <div class="info-item">

            <strong>🎮 MODE</strong>

            <span>
              ${data.mode || "-"}
            </span>

          </div>


          <div class="info-item">

            <strong>🗺 MAP</strong>

            <span>
              ${data.map || "-"}
            </span>

          </div>


          <div class="info-item">

            <strong>📅 DATE</strong>

            <span>
              ${data.date || "-"}
            </span>

          </div>


          <div class="info-item">

            <strong>🕒 TIME</strong>

            <span>
              ${data.time || "-"}
            </span>

          </div>


          <div class="info-item">

            <strong>💰 FEE</strong>

            <span>
              ${data.fee || 0} ৳
            </span>

          </div>


          <div class="info-item">

            <strong>🏆 PRIZE</strong>

            <span>
              ${data.firstPrize || "-"}
            </span>

          </div>

        </div>


        <div class="registered-box">

          <strong>
            👥 Registered
          </strong>

          <div class="registered-count">

            ${approved} / ${maxTeams}

          </div>

        </div>


        <button
          class="register-btn"
          data-id="${tournamentId}">

          📝 Register

        </button>

      `;


      /* ===============================
         REGISTER BUTTON
      ================================ */

      const registerButton =
        card.querySelector(".register-btn");


      registerButton.addEventListener(
        "click",
        () => {

          location.href =
            `tournament.html?tournament=${tournamentId}`;

        }
      );


      tournamentList.appendChild(card);

    });


    /* ===============================
       NO ACTIVE TOURNAMENTS
    ================================ */

    if (!activeFound) {

      tournamentList.innerHTML = `

        <div class="no-tournaments">

          🏆 No tournaments available
          right now.

          <br><br>

          Please check back later.

        </div>

      `;

    }

  }

  catch (error) {

    console.error(
      "Tournament loading error:",
      error
    );


    tournamentList.innerHTML = `

      <div class="no-tournaments">

        ❌ Failed to load tournaments.

        <br><br>

        Please try again later.

      </div>

    `;

  }

}


/* ===============================
   AUTH CHECK
================================ */

onAuthStateChanged(
  auth,
  async (user) => {

    if (!user) {

      location.href =
        "index.html";

      return;

    }


    await loadTournaments();

  }
);
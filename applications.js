import { auth, db } from "./firebase.js";

import {
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

import {
  doc,
  getDoc,
  collection,
  getDocs,
  updateDoc,
  deleteDoc
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

const applicationsList = document.getElementById("applicationsList");

const totalTeams =
  document.getElementById("totalTeams");

const pendingTeams =
  document.getElementById("pendingTeams");

const approvedTeams =
  document.getElementById("approvedTeams");

const rejectedTeams =
  document.getElementById("rejectedTeams");

const searchInput =
  document.getElementById("searchInput");
const clearAllBtn =
  document.getElementById("clearAllBtn");
const filterButtons =
  document.querySelectorAll(".filter-btn");

let currentFilter = "All";

let allRegistrations = [];

onAuthStateChanged(auth, async (user) => {
  
  if (!user) {
    
    location.href = "index.html";
    
    return;
    
  }
  
  const adminSnap = await getDoc(
    doc(db, "admins", user.uid)
  );
  
  if (!adminSnap.exists()) {
    
    alert("Access denied.");
    
    location.href = "dashboard.html";
    
    return;
    
  }
  
  await loadApplications();
  
  clearAllBtn.addEventListener("click", clearAllRegistrations);
  searchInput.addEventListener("input", () => {
    
    renderApplications();
    
  });
  
  filterButtons.forEach((button) => {
    
    button.addEventListener("click", () => {
      
      filterButtons.forEach((b) =>
        b.classList.remove("active")
      );
      
      button.classList.add("active");
      
      currentFilter =
        button.dataset.filter;
      
      renderApplications();
      
    });
    
  });
  
});
async function loadApplications() {

  const snapshot = await getDocs(
    collection(db, "registrations")
  );

  allRegistrations = [];

  snapshot.forEach((registration) => {

    allRegistrations.push({

      id: registration.id,

      ...registration.data()

    });

  });

  renderApplications();

}

function renderApplications() {

  applicationsList.innerHTML = "";

  let total = 0;
  let pending = 0;
  let approved = 0;
  let rejected = 0;

  allRegistrations.forEach((data) => {

    total++;

    switch (data.status) {

      case "Approved":
        approved++;
        break;

      case "Rejected":
        rejected++;
        break;

      default:
        pending++;

    }

  });

  totalTeams.textContent = total;
  pendingTeams.textContent = pending;
  approvedTeams.textContent = approved;
  rejectedTeams.textContent = rejected;

  let keyword =
    searchInput.value.trim().toLowerCase();

  let filtered = allRegistrations.filter((data) => {

const searchable = [
  
  data.teamName,
  
  data.leaderIGN,
  
  data.partnerIGN,
  
  data.player3IGN,
  
  data.player4IGN,
  
  data.player5IGN,
  
  data.leaderUID,
  
  data.partnerUID,
  
  data.player3UID,
  
  data.player4UID,
  
  data.player5UID,
  
  data.email
  
]

    .join(" ")

    .toLowerCase();

    const searchMatch =
      searchable.includes(keyword);

    const filterMatch =
      currentFilter === "All" ||
      data.status === currentFilter;

    return searchMatch && filterMatch;

  });

  if (filtered.length === 0) {

    applicationsList.innerHTML =

      "<div class='empty'>No matching registrations found.</div>";

    return;

  }

  filtered.forEach((data) => {

    let statusColor = "#ffd633";

    if (data.status === "Approved")
      statusColor = "#28c76f";

    if (data.status === "Rejected")
      statusColor = "#ea5455";

    const card = document.createElement("div");

    card.className = "card";
        card.innerHTML = `

      <h2>🏆 ${data.tournamentName}</h2>

      <p><strong>👥 Team:</strong> ${data.teamName || "-"}</p>

      <p><strong>👤 Leader:</strong> ${data.leaderIGN || "-"}</p>

      <p><strong>🆔 Leader UID:</strong> ${data.leaderUID || "-"}</p>

    <p><strong>👥 Player 2:</strong> ${data.partnerIGN || "-"}</p>

<p><strong>🆔 Player 2 UID:</strong> ${data.partnerUID || "-"}</p>

${data.player3IGN ? `
<p><strong>👥 Player 3:</strong> ${data.player3IGN}</p>
<p><strong>🆔 Player 3 UID:</strong> ${data.player3UID}</p>
` : ""}

${data.player4IGN ? `
<p><strong>👥 Player 4:</strong> ${data.player4IGN}</p>
<p><strong>🆔 Player 4 UID:</strong> ${data.player4UID}</p>
` : ""}

${data.player5IGN ? `
<p><strong>👥 Player 5:</strong> ${data.player5IGN}</p>
<p><strong>🆔 Player 5 UID:</strong> ${data.player5UID}</p>
` : ""}

      <p><strong>🌍 Address:</strong> ${data.country || "-"}</p>

      <p><strong>📱 Phone:</strong> ${data.phone || "-"}</p>

      <p><strong>💳 bKash:</strong> ${data.bkashNumber || "-"}</p>

      <p><strong>📧 Email:</strong> ${data.email || "-"}</p>

      <p class="status" style="color:${statusColor};">

        ${data.status}

      </p>

      <div class="actions">

  <button class="approve">
    ✅ Approve
  </button>

  <button class="reject">
    ❌ Reject
  </button>

  <button class="delete">
    🗑 Delete
  </button>

</div>

    `;

    const approveBtn =
      card.querySelector(".approve");

    const rejectBtn =
      card.querySelector(".reject");
const deleteBtn =
  card.querySelector(".delete");
  
    if (data.status === "Approved" ||
  data.status === "Rejected") {
  
  approveBtn.style.display = "none";
  rejectBtn.style.display = "none";
  
}

// Delete button is always visible
        approveBtn.onclick = async () => {

      await updateDoc(

        doc(db, "registrations", data.id),

        {

          status: "Approved"

        }

      );

      await loadApplications();

    };

    rejectBtn.onclick = async () => {

  await updateDoc(

    doc(db, "registrations", data.id),

    {

      status: "Rejected"

    }

  );

  await loadApplications();

};

deleteBtn.onclick = async () => {

  const confirmed = confirm(
    "⚠️ Delete this registration permanently?\n\nThis action cannot be undone."
  );

  if (!confirmed) return;

  await deleteDoc(
    doc(db, "registrations", data.id)
  );

  await loadApplications();

};

applicationsList.appendChild(card);

});

}

// =======================================
// Clear All Registrations
// =======================================

async function clearAllRegistrations() {
  
  const confirmed = confirm(
    "⚠️ Delete ALL registrations?\n\nThis action cannot be undone."
  );
  
  if (!confirmed) return;
  
  const snapshot = await getDocs(
    collection(db, "registrations")
  );
  
  for (const registration of snapshot.docs) {
    await deleteDoc(registration.ref);
  }
  
  await loadApplications();
  
  alert("✅ All registrations have been deleted.");
  
}
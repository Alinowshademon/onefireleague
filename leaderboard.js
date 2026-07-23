import { db } from "./firebase.js";

import {
collection,
query,
orderBy,
onSnapshot
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

const firstName = document.getElementById("firstName");
const firstPoints = document.getElementById("firstPoints");

const secondName = document.getElementById("secondName");
const secondPoints = document.getElementById("secondPoints");

const thirdName = document.getElementById("thirdName");
const thirdPoints = document.getElementById("thirdPoints");

const tbody = document.getElementById("leaderboardBody");

const q = query(
collection(db, "leaderboard"),
orderBy("points", "desc")
);

onSnapshot(q, (snapshot) => {

let players = [];

snapshot.forEach((doc) => {
players.push({
id: doc.id,
...doc.data()
});
});

// ---------- Top 3 ----------

const top = [
players[0] || { name: "---", points: 0 },
players[1] || { name: "---", points: 0 },
players[2] || { name: "---", points: 0 }
];

firstName.textContent = top[0].name;
firstPoints.textContent = top[0].points + " pts";

secondName.textContent = top[1].name;
secondPoints.textContent = top[1].points + " pts";

thirdName.textContent = top[2].name;
thirdPoints.textContent = top[2].points + " pts";

// ---------- Table ----------

tbody.innerHTML = "";

players.forEach((player, index) => {

tbody.innerHTML += `
<tr>
<td>${index + 1}</td>
<td>${player.name}</td>
<td>${player.points}</td>
</tr>
`;

});

if(players.length===0){

tbody.innerHTML=`
<tr>
<td colspan="3">
No players found.
</td>
</tr>
`;

}

});
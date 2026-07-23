import { db } from "./firebase.js";

import {
collection,
addDoc,
deleteDoc,
doc,
updateDoc,
query,
orderBy,
onSnapshot
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

// ====================================
// USE THE SAME ADMIN CHECK YOU ALREADY
// HAVE IN match-control.js
// ====================================



// ====================================

const playerName = document.getElementById("playerName");
const playerPoints = document.getElementById("playerPoints");
const saveBtn = document.getElementById("saveBtn");
const table = document.getElementById("leaderboardTable");

let editId = null;

saveBtn.onclick = async () => {

const name = playerName.value.trim();
const points = Number(playerPoints.value);

if(name==="" || isNaN(points)){
alert("Enter player name and points.");
return;
}

if(editId){

await updateDoc(doc(db,"leaderboard",editId),{

name:name,
points:points

});

saveBtn.textContent="➕ Add Player";
editId=null;

}else{

await addDoc(collection(db,"leaderboard"),{

name:name,
points:points

});

}

playerName.value="";
playerPoints.value="";

};

const q=query(

collection(db,"leaderboard"),

orderBy("points","desc")

);

onSnapshot(q,(snapshot)=>{

table.innerHTML="";

let rank=1;

snapshot.forEach((player)=>{

const data=player.data();

table.innerHTML+=`

<tr>

<td>${rank}</td>

<td>${data.name}</td>

<td>${data.points}</td>

<td>

<button
class="editBtn"
data-id="${player.id}"
data-name="${data.name}"
data-points="${data.points}">

✏ Edit

</button>

<button
class="deleteBtn"
data-id="${player.id}">

🗑 Delete

</button>

</td>

</tr>

`;

rank++;

});

if(snapshot.empty){

table.innerHTML=`

<tr>

<td colspan="4">

No players found.

</td>

</tr>

`;

}

// Edit

document.querySelectorAll(".editBtn").forEach(btn=>{

btn.onclick=()=>{

editId=btn.dataset.id;

playerName.value=btn.dataset.name;

playerPoints.value=btn.dataset.points;

saveBtn.textContent="💾 Update Player";

};

});

// Delete

document.querySelectorAll(".deleteBtn").forEach(btn=>{

btn.onclick=async()=>{

if(confirm("Delete this player?")){

await deleteDoc(

doc(db,"leaderboard",btn.dataset.id)

);

}

};

});

});
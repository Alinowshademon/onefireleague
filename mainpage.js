import { db } from "./firebase.js";

import { 
doc,
onSnapshot
}
from
"https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";



// DUO MATCH

const duoRef = doc(db,"matches","duo");


onSnapshot(duoRef,(snap)=>{


if(snap.exists()){


let data = snap.data();


document.getElementById("duoDate").innerText = data.date;

document.getElementById("duoTime").innerText = data.time;

document.getElementById("duoMap").innerText = data.map;

document.getElementById("duoRoom").innerText = data.roomId;

document.getElementById("duoPass").innerText = data.password;


}


});






// WEEKLY MATCH


const weeklyRef = doc(db,"matches","weekly");


onSnapshot(weeklyRef,(snap)=>{


if(snap.exists()){


let data = snap.data();



document.getElementById("weeklyDate").innerText = data.date;

document.getElementById("weeklyTime").innerText = data.time;

document.getElementById("weeklyMap").innerText = data.map;

document.getElementById("weeklyRoom").innerText = data.roomId;

document.getElementById("weeklyPass").innerText = data.password;


}


});






// COPY BUTTON

window.copyText = function(id){


let text = document.getElementById(id).innerText;


navigator.clipboard.writeText(text);


alert("Copied!");

}
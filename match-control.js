// match-control.js

import { auth, db } from "./firebase.js";

import {
onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

import {
doc,
setDoc,
getDoc
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";



// ADMIN CHECK

onAuthStateChanged(auth, async (user)=>{


if(!user){

location.href="index.html";

return;

}


const adminRef = doc(db,"admins",user.uid);

const adminSnap = await getDoc(adminRef);



if(!adminSnap.exists()){


alert("Access denied");

location.href="dashboard.html";


return;


}



console.log("Admin verified");


});






// UPDATE DUO MATCH


window.updateDuo = async function(){


let data = {


date: document.getElementById("duoDate").value,

time: document.getElementById("duoTime").value,

map: document.getElementById("duoMap").value,

roomId: document.getElementById("duoRoom").value,

password: document.getElementById("duoPass").value


};



try{


await setDoc(
  doc(db, "matches", "match1"),
  data
);


alert("Duo Match Updated");


}


catch(error){


console.error(error);

alert("Update failed");


}


};








// UPDATE WEEKLY MATCH


window.updateWeekly = async function(){



let data = {


date: document.getElementById("weeklyDate").value,

time: document.getElementById("weeklyTime").value,

map: document.getElementById("weeklyMap").value,

roomId: document.getElementById("weeklyRoom").value,

password: document.getElementById("weeklyPass").value


};



try{


await setDoc(
doc(db,"matches","match2"),
data
);



alert("Weekly Match Updated");


}


catch(error){


console.error(error);

alert("Update failed");


}


};
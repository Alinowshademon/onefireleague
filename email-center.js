import { db } from "./firebase.js";

import {
doc,
setDoc,
getDoc,
collection,
getDocs,
query,
where,
updateDoc
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";


// ===============================
// EMAILJS SETUP
// ===============================

emailjs.init({
  publicKey: "78Gs3GnuhIrKGOawg",
});


// ===============================
// ELEMENTS
// ===============================

const failedSection =
document.getElementById("failedSection");

const failedList =
document.getElementById("failedList");

const retryBtn =
document.getElementById("retryBtn");

const emailProgress =
document.getElementById("emailProgress");


const progressText =
document.getElementById("progressText");


const emailLog =
document.getElementById("emailLog");

const tournamentName =
document.getElementById("tournamentName");

const matchDate =
document.getElementById("matchDate");

const matchTime =
document.getElementById("matchTime");

const matchMap =
document.getElementById("matchMap");

const roomId =
document.getElementById("roomId");

const roomPass =
document.getElementById("roomPass");

const prize =
document.getElementById("prize");


const saveBtn =
document.getElementById("saveBtn");


const sendBtn =
document.getElementById("sendBtn");


// ===============================
// FIRESTORE LOCATION
// ===============================

const matchRef =
doc(db, "emailSettings", "matchDetails");


// ===============================
// LOAD SAVED DETAILS
// ===============================

async function loadDetails(){

const snap =
await getDoc(matchRef);


if(!snap.exists()) return;


const data =
snap.data();


tournamentName.value =
data.tournamentName || "";

matchDate.value =
data.date || "";

matchTime.value =
data.time || "";

matchMap.value =
data.map || "";

roomId.value =
data.roomId || "";

roomPass.value =
data.roomPass || "";

prize.value =
data.prize || "";

}


loadDetails();


// ===============================
// SAVE MATCH DETAILS
// ===============================

saveBtn.addEventListener("click", async()=>{


await setDoc(matchRef,{

tournamentName:
tournamentName.value,

date:
matchDate.value,

time:
matchTime.value,

map:
matchMap.value,

roomId:
roomId.value,

roomPass:
roomPass.value,

prize:
prize.value

});


alert("✅ Match details saved.");

});




// ===============================
// SEND EMAILS
// ===============================

sendBtn.addEventListener("click", async()=>{


const confirmSend =
confirm(
"📧 Send match details to all approved players?"
);


if(!confirmSend) return;


sendBtn.disabled = true;

sendBtn.textContent =
"⏳ Sending...";


emailProgress.style.display =
"block";

emailLog.innerHTML = "";

progressText.textContent =
"Preparing emails...";



try{


const matchSnap =
await getDoc(matchRef);



if(!matchSnap.exists()){


alert(
"⚠️ Save match details first."
);


return;

}



const match =
matchSnap.data();



const approvedQuery =
query(

collection(db,"registrations"),

where(
"status",
"==",
"Approved"
)

);



const players =
await getDocs(approvedQuery);



let sent = 0;

let failed = 0;

let total =
players.size;

let current = 0;



for(const player of players.docs){


current++;


progressText.textContent =
`Sending ${current} / ${total}`;



const data =
player.data();



try{


await emailjs.send(

"service_qrhvfgf",

"template_t050bnq",

{

to_email:
data.email,

player_name:
data.leaderIGN,

tournament:
match.tournamentName,

match_date:
match.date,

match_time:
match.time,

map:
match.map,

room_id:
match.roomId,

room_pass:
match.roomPass,

prize:
match.prize

}

);



await updateDoc(

doc(
db,
"registrations",
player.id
),

{

emailStatus:
"Sent",

emailError:"",

lastEmailSent:
new Date()

}

);



sent++;


emailLog.innerHTML +=
`
<p>
🟢 ${data.leaderIGN || "Player"} - Sent
</p>
`;



}


catch(error){


await updateDoc(

doc(
db,
"registrations",
player.id
),

{

emailStatus:
"Failed",

emailError:
error.message,

lastEmailSent:
new Date()

}

);



failed++;


emailLog.innerHTML +=
`
<p>
🔴 ${data.leaderIGN || "Player"} - Failed
</p>
`;



}



}

if (failed > 0) {
  
  await loadFailedEmails();
  
}

alert(

`📧 Email Report

Approved Players: ${players.size}

✅ Sent: ${sent}

❌ Failed: ${failed}`

);



}

catch(error){


console.error(error);


alert(
"❌ Email system error."
);


}



sendBtn.disabled = false;


sendBtn.textContent =
"📧 Send Match Details";


});

// ===============================
// LOAD FAILED EMAILS
// ===============================

async function loadFailedEmails() {
  
  
  const failedQuery =
    query(
      
      collection(db, "registrations"),
      
      where(
        "emailStatus",
        "==",
        "Failed"
      )
      
    );
  
  
  const snapshot =
    await getDocs(failedQuery);
  
  
  failedList.innerHTML = "";
  
  
  if (snapshot.empty) {
    
    failedSection.style.display =
      "none";
    
    return;
    
  }
  
  
  
  failedSection.style.display =
    "block";
  
  
  
  snapshot.forEach((player) => {
    
    
    const data =
      player.data();
    
    
    
    failedList.innerHTML +=
      `

<div style="
background:#24334d;
padding:12px;
margin:10px 0;
border-radius:12px;
">

<p>
❌ ${data.leaderIGN || "Player"}
</p>

<p>
📧 ${data.email || "-"}
</p>

<p>
⚠️ ${data.emailError || "Unknown error"}
</p>

</div>

`;
    
  });
  
  
}

// ===============================
// RETRY FAILED EMAILS
// ===============================

retryBtn.addEventListener(
"click",
async()=>{


const confirmRetry =
confirm(
"🔄 Retry sending failed emails only?"
);


if(!confirmRetry) return;


retryBtn.disabled = true;

retryBtn.textContent =
"⏳ Retrying...";



try{


const matchSnap =
await getDoc(matchRef);


if(!matchSnap.exists()){

alert(
"⚠️ Match details not found."
);

return;

}



const match =
matchSnap.data();



const failedQuery =
query(

collection(db,"registrations"),

where(
"emailStatus",
"==",
"Failed"
)

);



const failedPlayers =
await getDocs(failedQuery);



let sent = 0;

let failed = 0;



for(const player of failedPlayers.docs){


const data =
player.data();



try{


await emailjs.send(

"service_qrhvfgf",

"template_t050bnq",

{

to_email:
data.email,

player_name:
data.leaderIGN,

tournament:
match.tournamentName,

match_date:
match.date,

match_time:
match.time,

map:
match.map,

room_id:
match.roomId,

room_pass:
match.roomPass,

prize:
match.prize

}

);



await updateDoc(

doc(
db,
"registrations",
player.id
),

{

emailStatus:
"Sent",

emailError:"",

lastEmailSent:
new Date()

}

);


sent++;


}


catch(error){


await updateDoc(

doc(
db,
"registrations",
player.id
),

{

emailError:
error.message

}

);


failed++;


}


}



alert(

`🔄 Retry Complete

✅ Sent: ${sent}

❌ Failed: ${failed}`

);



await loadFailedEmails();



retryBtn.disabled = false;

retryBtn.textContent =
"🔄 Retry Failed Emails";

}
catch(error){

console.error(error);

alert(
"❌ Retry system error."
);

retryBtn.disabled = false;

retryBtn.textContent =
"🔄 Retry Failed Emails";

}

});
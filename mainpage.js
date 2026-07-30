import { db } from "./firebase.js";

import {
collection,
query,
orderBy,
onSnapshot
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

const feed = document.getElementById("feed");

function getEmbedUrl(url){

try{

// youtu.be/xxxx
if(url.includes("youtu.be/")){
const id = url.split("youtu.be/")[1].split("?")[0];
return `https://www.youtube.com/embed/${id}`;
}

// youtube.com/watch?v=xxxx
const u = new URL(url);
const id = u.searchParams.get("v");

if(id){
return `https://www.youtube.com/embed/${id}`;
}

}catch(e){}

return null;

}

const q = collection(db, "newsfeed");

onSnapshot(q,(snapshot)=>{

feed.innerHTML="";

if(snapshot.empty){

feed.innerHTML=`
<div class="news-card">
<h1>🔥 Latest Videos</h1>
<p style="text-align:center;">
No videos available yet.
</p>
</div>
`;

return;

}

let html = `
<div class="news-card">
<h1>🔥 Latest Videos</h1>
`;

let number = 1;

snapshot.forEach(doc=>{

const data = doc.data();

const embed = getEmbedUrl(data.url);

if(!embed) return;

html += `
<h3>${number}. ${data.title || "Video"}</h3>

<div class="video-box">

<iframe
src="${embed}"
title="Video ${number}"
allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
allowfullscreen>
</iframe>

</div>

`;

number++;

});

html += `

<a href="dashboard.html" class="back-btn">
⬅️ Back to Dashboard
</a>

</div>
`;

feed.innerHTML = html;

});
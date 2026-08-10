
import { auth, db } from "./firebase.js";

import {
  signOut
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

import {
  collection,
  query,
  orderBy,
  onSnapshot
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

const feed = document.getElementById("feed");

const q = query(
  collection(db, "newsfeed"),
  orderBy("createdAt", "desc")
);

onSnapshot(q, (snapshot) => {

  feed.innerHTML = "";

  if (snapshot.empty) {

    feed.innerHTML = `
      <div class="news-card">
        <h1>🔥 Latest Updates</h1>
        <p style="text-align:center;">
          No posts available yet.
        </p>

        <a href="dashboard.html" class="back-btn">
          ⬅️ Back to Dashboard
        </a>
      </div>
    `;

    return;
  }

  let html = `
    <div class="news-card">
      <h1>🔥 Latest Updates</h1>
  `;

  let number = 1;

  snapshot.forEach((doc) => {

    const data = doc.data();

    html += `

      <h3>${number}. ${data.title || "News Update"}</h3>

      <div class="fb-post"
     data-href="${data.url}"
     data-show-text="true">
</div>

      <br>

    `;

    number++;

  });

  html += `

    

    </div>
  `;

  feed.innerHTML = html;

  // Tell Facebook SDK to render the embeds
  if (window.FB && window.FB.XFBML) {
    window.FB.XFBML.parse(feed);
  }

});
const logoutBtn = document.getElementById("logoutBtn");

logoutBtn.addEventListener("click", async (e) => {
  e.preventDefault();

  try {
    await signOut(auth);
    window.location.href = "index.html";
  } catch (error) {
    alert(error.message);
  }
});
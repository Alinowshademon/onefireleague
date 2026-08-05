import { auth, db } from "./firebase.js";

import {
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  getDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

onAuthStateChanged(auth, async (user) => {

  // Not logged in
  if (!user) {
    location.href = "index.html";
    return;
  }

  // Admin check
  const adminRef = doc(db, "admins", user.uid);
  const adminSnap = await getDoc(adminRef);

  if (!adminSnap.exists()) {
    alert("Access denied! Admins only.");
    location.href = "dashboard.html";
    return;
  }

  // Elements
  const titleInput = document.getElementById("postTitle");
  const urlInput = document.getElementById("postUrl");
  const addBtn = document.getElementById("addPost");
  const postList = document.getElementById("postList");
  const status = document.getElementById("status");

  // Publish Post
  addBtn.onclick = async () => {

    const title = titleInput.value.trim();
    const url = urlInput.value.trim();

    if (!url) {
      status.textContent = "Please enter a Facebook post URL.";
      return;
    }

    try {

      await addDoc(collection(db, "newsfeed"), {
        title: title || "Untitled Post",
        url: url,
        createdAt: serverTimestamp()
      });

      status.textContent = "✅ Post published successfully.";

      titleInput.value = "";
      urlInput.value = "";

      loadPosts();

    } catch (error) {

      status.textContent = error.message;

    }

  };

  // Load Posts
  async function loadPosts() {

    postList.innerHTML = "Loading...";

    try {

      const snapshot = await getDocs(collection(db, "newsfeed"));

      postList.innerHTML = "";

      if (snapshot.empty) {

        postList.innerHTML = "<p>No posts published.</p>";
        return;

      }

      snapshot.forEach((post) => {

        const data = post.data();

        const div = document.createElement("div");
        div.className = "post";

        div.innerHTML = `
          <p><strong>${data.title || "Untitled Post"}</strong></p>

          <p style="margin-top:10px;">
            <a href="${data.url}" target="_blank">
              ${data.url}
            </a>
          </p>

          <button
            class="deleteBtn"
            data-id="${post.id}">
            🗑 Delete
          </button>
        `;

        postList.appendChild(div);

      });

    } catch (error) {

      postList.innerHTML = error.message;

    }

  }

  // Delete Post
  async function deletePost(id) {

    if (!confirm("Delete this post?")) return;

    try {

      await deleteDoc(doc(db, "newsfeed", id));

      status.textContent = "🗑 Post deleted.";

      loadPosts();

    } catch (error) {

      status.textContent = error.message;

    }

  }

  // Delete button
  document.addEventListener("click", (e) => {

    if (e.target.classList.contains("deleteBtn")) {

      deletePost(e.target.dataset.id);

    }

  });

  // Initial load
  loadPosts();

});
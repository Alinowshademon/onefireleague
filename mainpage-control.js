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
        
        // Check if user is an admin
        const adminRef = doc(db, "admins", user.uid);
        const adminSnap = await getDoc(adminRef);
        
        if (!adminSnap.exists()) {
          alert("Access denied! Admins only.");
          location.href = "dashboard.html";
          return;
        }
        
        // Admin only below this line
        
        const titleInput = document.getElementById("videoTitle");
        const urlInput = document.getElementById("videoUrl");
        const addBtn = document.getElementById("addVideo");
        const videoList = document.getElementById("videoList");
        const status = document.getElementById("status");
        
        // Add Video
        addBtn.onclick = async () => {
          
          const url = urlInput.value.trim();
          
          if (!url) {
            status.textContent = "Please enter a YouTube URL.";
            return;
          }
          
          try {
            
            await addDoc(collection(db, "newsfeed"), {
              title: titleInput.value.trim(),
              url: url,
              createdAt: serverTimestamp()
            });
            
            status.textContent = "✅ Video added.";
            
            titleInput.value = "";
            urlInput.value = "";
            
            loadVideos();
            
          } catch (error) {
            
            status.textContent = error.message;
            
          }
          
        };
        
        // Load Videos
        async function loadVideos() {
            
            videoList.innerHTML = "Loading...";
            
            try {
              
              const snapshot = await getDocs(collection(db, "newsfeed"));
              
              videoList.innerHTML = "";
                    if (snapshot.empty) {

        videoList.innerHTML = "<p>No videos uploaded.</p>";
        return;

      }

      snapshot.forEach((video) => {

        const data = video.data();

        const div = document.createElement("div");
        div.className = "video";

        div.innerHTML = `
<p><strong>${data.title || "Untitled Video"}</strong></p>

<a href="${data.url}" target="_blank">${data.url}</a>

<br><br>

<button class="deleteBtn" data-id="${video.id}">
🗑 Delete
</button>
`;

        videoList.appendChild(div);

      });

    } catch (error) {

      videoList.innerHTML = error.message;

    }

  }

  // Delete Video
  async function deleteVideo(id) {

    if (!confirm("Delete this video?")) return;

    try {

      await deleteDoc(doc(db, "newsfeed", id));

      status.textContent = "🗑 Video deleted.";

      loadVideos();

    } catch (error) {

      status.textContent = error.message;

    }

  }

  // Load videos when page opens
  loadVideos();

  // Delete button click
  document.addEventListener("click", (e) => {

    if (e.target.classList.contains("deleteBtn")) {

      deleteVideo(e.target.dataset.id);

    }

  });

});
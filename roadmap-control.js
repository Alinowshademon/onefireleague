import { auth, db } from "./firebase.js";

import {
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

import {
    doc,
    getDoc,
    setDoc
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

const textarea = document.getElementById("roadmap");
const status = document.getElementById("status");
const saveBtn = document.getElementById("saveBtn");

onAuthStateChanged(auth, async (user) => {

    if (!user) {
        location.href = "index.html";
        return;
    }

    try {

        // Admin check
        const adminRef = doc(db, "admins", user.uid);
        const adminSnap = await getDoc(adminRef);

        if (!adminSnap.exists()) {
            alert("Access denied.");
            location.href = "dashboard.html";
            return;
        }

        // Load roadmap
        const roadmapRef = doc(db, "settings", "roadmap");
        const roadmapSnap = await getDoc(roadmapRef);

        if (roadmapSnap.exists()) {

            textarea.value = roadmapSnap.data().content || "";

        }

    } catch (error) {

        console.error(error);
        alert("Failed to load roadmap.");

    }

});

saveBtn.addEventListener("click", async () => {

    try {

        await setDoc(doc(db, "settings", "roadmap"), {

            content: textarea.value.trim()

        });

        status.style.color = "#7CFC00";
        status.textContent = "✅ Roadmap updated successfully.";

    } catch (error) {

        console.error(error);

        status.style.color = "#ff4d4d";
        status.textContent = "❌ Failed to update roadmap.";

    }

});
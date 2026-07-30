import { db } from "./firebase.js";

import {
    doc,
    getDoc
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

async function loadRoadmap() {

    try {

        const roadmapRef = doc(db, "settings", "roadmap");
        const roadmapSnap = await getDoc(roadmapRef);

        if (!roadmapSnap.exists()) {
            document.getElementById("roadmapContent").textContent =
                "No roadmap has been published yet.";
            return;
        }

        const data = roadmapSnap.data();

        document.getElementById("roadmapContent").textContent =
            data.content || "No roadmap has been published yet.";

    } catch (error) {

        console.error(error);

        document.getElementById("roadmapContent").textContent =
            "Failed to load roadmap.";

    }

}

loadRoadmap();
import { db } from "./firebase.js";

import {
    doc,
    getDoc
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

async function loadPointSystem() {

    try {

        const docRef = doc(db, "settings", "pointsystem");
        const docSnap = await getDoc(docRef);

        if (!docSnap.exists()) {
            console.log("Point system not found.");
            return;
        }

        const data = docSnap.data();

        document.getElementById("p1").textContent = data.p1 ?? 12;
        document.getElementById("p2").textContent = data.p2 ?? 9;
        document.getElementById("p3").textContent = data.p3 ?? 8;
        document.getElementById("p4").textContent = data.p4 ?? 7;
        document.getElementById("p5").textContent = data.p5 ?? 6;
        document.getElementById("p6").textContent = data.p6 ?? 5;
        document.getElementById("p7").textContent = data.p7 ?? 4;
        document.getElementById("p8").textContent = data.p8 ?? 3;
        document.getElementById("p9").textContent = data.p9 ?? 2;
        document.getElementById("p10").textContent = data.p10 ?? 1;

        document.getElementById("elimPoints").textContent =
            data.elimination ?? 1;

    } catch (error) {

        console.error("Error loading point system:", error);

    }

}

loadPointSystem();
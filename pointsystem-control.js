import { auth, db } from "./firebase.js";

import {
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

import {
    doc,
    getDoc,
    setDoc
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

const status = document.getElementById("status");
const saveBtn = document.getElementById("saveBtn");

onAuthStateChanged(auth, async (user) => {

    if (!user) {
        location.href = "index.html";
        return;
    }

    try {

        // Check admin permission
        const adminRef = doc(db, "admins", user.uid);
        const adminSnap = await getDoc(adminRef);

        if (!adminSnap.exists()) {
            alert("Access denied.");
            location.href = "dashboard.html";
            return;
        }

        // Load existing point system
        const pointRef = doc(db, "settings", "pointsystem");
        const pointSnap = await getDoc(pointRef);

        if (pointSnap.exists()) {

            const data = pointSnap.data();

            document.getElementById("p1").value = data.p1 ?? 12;
            document.getElementById("p2").value = data.p2 ?? 9;
            document.getElementById("p3").value = data.p3 ?? 8;
            document.getElementById("p4").value = data.p4 ?? 7;
            document.getElementById("p5").value = data.p5 ?? 6;
            document.getElementById("p6").value = data.p6 ?? 5;
            document.getElementById("p7").value = data.p7 ?? 4;
            document.getElementById("p8").value = data.p8 ?? 3;
            document.getElementById("p9").value = data.p9 ?? 2;
            document.getElementById("p10").value = data.p10 ?? 1;

            document.getElementById("elimination").value =
                data.elimination ?? 1;

        }

    } catch (error) {

        console.error(error);
        alert("Failed to load point system.");

    }

});

saveBtn.addEventListener("click", async () => {

    try {

        await setDoc(doc(db, "settings", "pointsystem"), {

            p1: Number(document.getElementById("p1").value),
            p2: Number(document.getElementById("p2").value),
            p3: Number(document.getElementById("p3").value),
            p4: Number(document.getElementById("p4").value),
            p5: Number(document.getElementById("p5").value),
            p6: Number(document.getElementById("p6").value),
            p7: Number(document.getElementById("p7").value),
            p8: Number(document.getElementById("p8").value),
            p9: Number(document.getElementById("p9").value),
            p10: Number(document.getElementById("p10").value),

            elimination: Number(document.getElementById("elimination").value)

        });

        status.textContent = "✅ Point system updated successfully.";

    } catch (error) {

        console.error(error);
        status.style.color = "#ff4d4d";
        status.textContent = "❌ Failed to update point system.";

    }

});
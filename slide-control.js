import { auth, db } from "./firebase.js";

import {
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-auth.js";

import {
  collection,
  getDocs,
  doc,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  query,
  orderBy
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";


const slidesContainer =
  document.getElementById("slidesContainer");

const slideUrl =
  document.getElementById("slideUrl");

const addSlideBtn =
  document.getElementById("addSlideBtn");


/* ===============================
   ADMIN CHECK
================================ */

async function checkAdmin(user) {

  const adminRef =
    doc(db, "admins", user.uid);

  const adminSnap =
    await getDoc(adminRef);

  if (!adminSnap.exists()) {

    alert("Access denied. Admins only.");

    location.href =
      "dashboard.html";

    return false;

  }

  return true;

}


/* ===============================
   LOAD SLIDES
================================ */

async function loadSlides() {

  slidesContainer.innerHTML = `
    <div class="loading">
      Loading slides...
    </div>
  `;


  try {

    const slidesQuery =
      query(
        collection(db, "slides"),
        orderBy("createdAt", "desc")
      );


    const snapshot =
      await getDocs(slidesQuery);


    if (snapshot.empty) {

      slidesContainer.innerHTML = `
        <div class="empty">
          🖼️ No slides published yet.
        </div>
      `;

      return;

    }


    slidesContainer.innerHTML = "";


    let number = 1;


    snapshot.forEach((slideDoc) => {

      const data =
        slideDoc.data();


      const card =
        document.createElement("div");

      card.className =
        "slide-card";


      card.innerHTML = `

        <div class="slide-number">
          Slide ${number}
        </div>

        <img
          src="${data.imageUrl}"
          class="slide-image"
          onerror="this.style.display='none'"
        >

        <div class="slide-url">
          ${data.imageUrl}
        </div>

        <div class="slide-actions">

          <button
            class="edit-btn"
            data-id="${slideDoc.id}"
            data-url="${data.imageUrl}"
          >
            ✏️ Edit
          </button>

          <button
            class="delete-btn"
            data-id="${slideDoc.id}"
          >
            🗑️ Delete
          </button>

        </div>

      `;


      slidesContainer.appendChild(card);


      number++;

    });


    /* ===============================
       EDIT BUTTONS
    ================================ */

    document
      .querySelectorAll(".edit-btn")
      .forEach((button) => {

        button.addEventListener(
          "click",
          async () => {

            const id =
              button.dataset.id;

            const oldUrl =
              button.dataset.url;


            const newUrl =
              prompt(
                "Enter the new image URL:",
                oldUrl
              );


            if (
              !newUrl ||
              newUrl.trim() === ""
            ) {

              return;

            }


            try {

              await updateDoc(
                doc(
                  db,
                  "slides",
                  id
                ),
                {
                  imageUrl:
                    newUrl.trim(),
                  updatedAt:
                    serverTimestamp()
                }
              );


              alert(
                "Slide updated successfully!"
              );


              loadSlides();

            }

            catch (error) {

              console.error(error);

              alert(
                "Failed to update slide."
              );

            }

          }
        );

      });


    /* ===============================
       DELETE BUTTONS
    ================================ */

    document
      .querySelectorAll(".delete-btn")
      .forEach((button) => {

        button.addEventListener(
          "click",
          async () => {

            const id =
              button.dataset.id;


            const confirmDelete =
              confirm(
                "Are you sure you want to delete this slide?"
              );


            if (!confirmDelete) {

              return;

            }


            try {

              await deleteDoc(
                doc(
                  db,
                  "slides",
                  id
                )
              );


              alert(
                "Slide deleted successfully!"
              );


              loadSlides();

            }

            catch (error) {

              console.error(error);

              alert(
                "Failed to delete slide."
              );

            }

          }
        );

      });

  }

  catch (error) {

    console.error(error);

    slidesContainer.innerHTML = `
      <div class="empty">
        ❌ Failed to load slides.
      </div>
    `;

  }

}


/* ===============================
   ADD NEW SLIDE
================================ */

addSlideBtn.addEventListener(
  "click",
  async () => {

    const url =
      slideUrl.value.trim();


    if (url === "") {

      alert(
        "Please paste an image URL."
      );

      return;

    }


    /* Basic image URL check */

    if (
      !url.startsWith("http://") &&
      !url.startsWith("https://")
    ) {

      alert(
        "Please enter a valid image URL."
      );

      return;

    }


    addSlideBtn.disabled = true;

    addSlideBtn.textContent =
      "Publishing...";


    try {

      await addDoc(
        collection(db, "slides"),
        {
          imageUrl: url,
          createdAt:
            serverTimestamp()
        }
      );


      slideUrl.value = "";


      alert(
        "Slide published successfully!"
      );


      await loadSlides();

    }

    catch (error) {

      console.error(error);

      alert(
        "Failed to publish slide."
      );

    }


    addSlideBtn.disabled = false;

    addSlideBtn.textContent =
      "➕ Publish Slide";

  }
);


/* ===============================
   START
================================ */

onAuthStateChanged(
  auth,
  async (user) => {

    if (!user) {

      location.href =
        "index.html";

      return;

    }


    const isAdmin =
      await checkAdmin(user);


    if (!isAdmin) {

      return;

    }


    await loadSlides();

  }
);
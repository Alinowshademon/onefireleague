import { db } from "./firebase.js";

import {
  collection,
  getDocs,
  query,
  orderBy
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";


const slideTrack =
document.getElementById("slideTrack");

const slideDots =
document.getElementById("slideDots");

let currentSlide = 0;
let totalSlides = 0;
let slideTimer = null;


/* ===============================
   LOAD SLIDES
================================ */

async function loadSlides(){

  try{

    const slidesQuery =
      query(
        collection(db,"slides"),
        orderBy("createdAt","desc")
      );

    const snapshot =
      await getDocs(slidesQuery);


    if(snapshot.empty){

      slideTrack.innerHTML = `
        <div class="slide-loading">
          No slides available
        </div>
      `;

      return;

    }


    slideTrack.innerHTML = "";
    slideDots.innerHTML = "";


    snapshot.forEach((slideDoc,index)=>{

      const data =
        slideDoc.data();


      /* SLIDE */

      const slide =
        document.createElement("div");

      slide.className =
        "slide-item";


      slide.innerHTML = `
        <img
          src="${data.imageUrl}"
          alt="∆NE FIRE LEAGUE"
        >
      `;


      slideTrack.appendChild(slide);


      /* DOT */

      const dot =
        document.createElement("div");

      dot.className =
        "slide-dot";


      if(index === 0){

        dot.classList.add("active");

      }


      slideDots.appendChild(dot);

    });


    totalSlides =
      snapshot.size;


    startAutoSlide();

    enableSwipe();

  }

  catch(error){

    console.error(
      "Failed to load slides:",
      error
    );

    slideTrack.innerHTML = `
      <div class="slide-loading">
        Failed to load slides
      </div>
    `;

  }

}


/* ===============================
   SHOW SLIDE
================================ */

function showSlide(index){

  if(totalSlides === 0){
    return;
  }


  currentSlide =
    (index + totalSlides) %
    totalSlides;


  slideTrack.style.transform =
    `translateX(-${currentSlide * 100}%)`;


  document
    .querySelectorAll(".slide-dot")
    .forEach((dot,i)=>{

      dot.classList.toggle(
        "active",
        i === currentSlide
      );

    });

}


/* ===============================
   AUTO SLIDE
================================ */

function startAutoSlide(){

  if(totalSlides <= 1){
    return;
  }


  clearInterval(slideTimer);


  slideTimer =
    setInterval(()=>{

      showSlide(
        currentSlide + 1
      );

    },4000);

}


/* ===============================
   TOUCH / SWIPE
================================ */

function enableSwipe(){

  let startX = 0;
  let endX = 0;


  slideTrack.addEventListener(
    "touchstart",
    (event)=>{

      startX =
        event.touches[0].clientX;

    },
    {passive:true}
  );


  slideTrack.addEventListener(
    "touchend",
    (event)=>{

      endX =
        event.changedTouches[0].clientX;


      const difference =
        startX - endX;


      if(Math.abs(difference) < 50){
        return;
      }


      if(difference > 0){

        showSlide(
          currentSlide + 1
        );

      }

      else{

        showSlide(
          currentSlide - 1
        );

      }


      startAutoSlide();

    },
    {passive:true}
  );

}


/* ===============================
   START
================================ */

loadSlides();
// =========================================
// NATUREVISION V3
// =========================================

// Ambil semua slide
const slides = document.querySelectorAll(".slide");

// Tombol
const startBtn = document.getElementById("startBtn");
const nextBtn = document.getElementById("next");
const prevBtn = document.getElementById("prev");
const page = document.getElementById("page");

// Slide aktif
let currentSlide = 0;

// =========================================
// TAMPILKAN SLIDE
// =========================================

function showSlide(index){

    if(index < 0) index = 0;

    if(index >= slides.length) index = slides.length - 1;

    slides.forEach(slide=>{
        slide.classList.remove("active");
    });

    slides[index].classList.add("active");

    currentSlide = index;

    updateUI();

}

// =========================================
// UPDATE NAVIGASI
// =========================================

function updateUI(){

    if(page){

        page.textContent = `${currentSlide + 1} / ${slides.length}`;

    }

    if(prevBtn){

        prevBtn.disabled = currentSlide === 0;

        prevBtn.style.opacity =
        currentSlide === 0 ? ".5" : "1";

    }

    if(nextBtn){

        nextBtn.disabled =
        currentSlide === slides.length - 1;

        nextBtn.style.opacity =
        currentSlide === slides.length - 1 ? ".5" : "1";

    }

}

// =========================================
// MULAI PRESENTASI
// =========================================

if(startBtn){

    startBtn.addEventListener("click",()=>{

        showSlide(1);

        if(document.documentElement.requestFullscreen){

            document.documentElement.requestFullscreen();

        }

    });

}

// =========================================
// NEXT
// =========================================

if(nextBtn){

    nextBtn.addEventListener("click",()=>{

        showSlide(currentSlide + 1);

    });

}

// =========================================
// BACK
// =========================================

if(prevBtn){

    prevBtn.addEventListener("click",()=>{

        showSlide(currentSlide - 1);

    });

}

// =========================================
// KEYBOARD
// =========================================

document.addEventListener("keydown",(e)=>{

    switch(e.key){

        case "ArrowRight":

            showSlide(currentSlide + 1);

        break;

        case "ArrowLeft":

            showSlide(currentSlide - 1);

        break;

        case "Home":

            showSlide(0);

        break;

        case "Escape":

            if(document.fullscreenElement){

                document.exitFullscreen();

            }

        break;

    }

});

// =========================================
// SWIPE HP
// =========================================

let startX = 0;

document.addEventListener("touchstart",(e)=>{

    startX = e.changedTouches[0].screenX;

});

document.addEventListener("touchend",(e)=>{

    const endX = e.changedTouches[0].screenX;

    if(startX - endX > 60){

        showSlide(currentSlide + 1);

    }

    if(endX - startX > 60){

        showSlide(currentSlide - 1);

    }

});

// =========================================
// LOAD
// =========================================

window.addEventListener("load",()=>{

    showSlide(0);

});
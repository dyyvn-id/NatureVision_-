/* =========================================================
   NATUREVISION — ULTRA PRESENTATION ENGINE
   Cocok dengan index.html + style.css ULTRA
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       ELEMENT
       ===================================================== */

    const slides = Array.from(
        document.querySelectorAll(".slide")
    );

    const startBtn = document.getElementById("startBtn");
    const prevBtn = document.getElementById("prevBtn");
    const nextBtn = document.getElementById("nextBtn");
    const page = document.getElementById("page");
    const progressBar = document.querySelector(".progress-bar");

    let currentSlide = 0;

    let presentationMode = false;


    /* =====================================================
       CEK ELEMENT
       ===================================================== */

    if (!slides.length) {
        console.error("Tidak ada .slide ditemukan.");
        return;
    }


    /* =====================================================
       UPDATE SLIDE
       ===================================================== */

    function updateSlide() {

        slides.forEach((slide, index) => {

            slide.classList.toggle(
                "active",
                index === currentSlide
            );

        });


        /* Nomor halaman */

        if (page) {

            page.textContent =
                `${currentSlide + 1} / ${slides.length}`;

        }


        /* Progress */

        if (progressBar) {

            const progress =
                ((currentSlide + 1) / slides.length) * 100;

            progressBar.style.width =
                `${progress}%`;

        }


        /* Tombol Back */

        if (prevBtn) {

            prevBtn.disabled =
                currentSlide === 0;

        }


        /* Tombol Next */

        if (nextBtn) {

            nextBtn.disabled =
                currentSlide === slides.length - 1;

        }


        /* Scroll kembali ke atas */

        slides[currentSlide].scrollTop = 0;

    }


    /* =====================================================
       NEXT
       ===================================================== */

    function nextSlide() {

        if (
            currentSlide <
            slides.length - 1
        ) {

            currentSlide++;

            updateSlide();

        }

    }


    /* =====================================================
       PREVIOUS
       ===================================================== */

    function previousSlide() {

        if (currentSlide > 0) {

            currentSlide--;

            updateSlide();

        }

    }


    /* =====================================================
       GO TO SLIDE
       ===================================================== */

    function goToSlide(index) {

        if (
            index < 0 ||
            index >= slides.length
        ) {
            return;
        }

        currentSlide = index;

        updateSlide();

    }


    /* =====================================================
       BUTTON NEXT
       ===================================================== */

    if (nextBtn) {

        nextBtn.addEventListener(
            "click",
            nextSlide
        );

    }


    /* =====================================================
       BUTTON BACK
       ===================================================== */

    if (prevBtn) {

        prevBtn.addEventListener(
            "click",
            previousSlide
        );

    }


    /* =====================================================
       START PRESENTATION
       ===================================================== */

    if (startBtn) {

        startBtn.addEventListener(
            "click",
            async () => {

                presentationMode = true;

                goToSlide(1);

                await enterFullscreen();

            }
        );

    }


    /* =====================================================
       FULLSCREEN
       ===================================================== */

    async function enterFullscreen() {

        try {

            if (
                !document.fullscreenElement &&
                document.documentElement.requestFullscreen
            ) {

                await document.documentElement
                    .requestFullscreen();

            }

        } catch (error) {

            console.log(
                "Fullscreen tidak tersedia:",
                error
            );

        }

    }


    /* =====================================================
       EXIT FULLSCREEN
       ===================================================== */

    async function exitFullscreen() {

        try {

            if (
                document.fullscreenElement &&
                document.exitFullscreen
            ) {

                await document.exitFullscreen();

            }

        } catch (error) {

            console.log(
                "Gagal keluar fullscreen:",
                error
            );

        }

    }


    /* =====================================================
       KEYBOARD CONTROL
       ===================================================== */

    document.addEventListener(
        "keydown",
        (event) => {

            const key = event.key;


            /* NEXT */

            if (
                key === "ArrowRight" ||
                key === " " ||
                key === "PageDown"
            ) {

                event.preventDefault();

                nextSlide();

            }


            /* BACK */

            else if (
                key === "ArrowLeft" ||
                key === "PageUp"
            ) {

                event.preventDefault();

                previousSlide();

            }


            /* HOME */

            else if (key === "Home") {

                event.preventDefault();

                goToSlide(0);

            }


            /* END */

            else if (key === "End") {

                event.preventDefault();

                goToSlide(
                    slides.length - 1
                );

            }


            /* ESC */

            else if (key === "Escape") {

                presentationMode = false;

                exitFullscreen();

            }

        }
    );


    /* =====================================================
       TOUCH / SWIPE
       ===================================================== */

    let touchStartX = 0;
    let touchStartY = 0;

    let touchEndX = 0;
    let touchEndY = 0;


    document.addEventListener(
        "touchstart",
        (event) => {

            if (!event.changedTouches.length) {
                return;
            }

            touchStartX =
                event.changedTouches[0].screenX;

            touchStartY =
                event.changedTouches[0].screenY;

        },
        {
            passive: true
        }
    );


    document.addEventListener(
        "touchend",
        (event) => {

            if (!event.changedTouches.length) {
                return;
            }

            touchEndX =
                event.changedTouches[0].screenX;

            touchEndY =
                event.changedTouches[0].screenY;

            handleSwipe();

        },
        {
            passive: true
        }
    );


    function handleSwipe() {

        const differenceX =
            touchEndX - touchStartX;

        const differenceY =
            touchEndY - touchStartY;


        /* Jangan dianggap swipe kalau
           gerakan lebih banyak vertikal */

        if (
            Math.abs(differenceY) >
            Math.abs(differenceX)
        ) {
            return;
        }


        /* Minimal jarak swipe */

        if (
            Math.abs(differenceX) < 60
        ) {
            return;
        }


        /* Swipe kiri = NEXT */

        if (differenceX < 0) {

            nextSlide();

        }


        /* Swipe kanan = BACK */

        else {

            previousSlide();

        }

    }


    /* =====================================================
       CLICK AREA
       ===================================================== */

    document.addEventListener(
        "click",
        (event) => {

            /* Jangan mengganggu tombol */

            if (
                event.target.closest(
                    "button, a"
                )
            ) {
                return;
            }


            /* Hanya aktif dalam fullscreen */

            if (!presentationMode) {
                return;
            }


            const width =
                window.innerWidth;


            /* Klik kanan layar = NEXT */

            if (
                event.clientX >
                width * 0.65
            ) {

                nextSlide();

            }


            /* Klik kiri layar = BACK */

            else if (
                event.clientX <
                width * 0.35
            ) {

                previousSlide();

            }

        }
    );


    /* =====================================================
       FULLSCREEN CHANGE
       ===================================================== */

    document.addEventListener(
        "fullscreenchange",
        () => {

            if (!document.fullscreenElement) {

                presentationMode = false;

            }

        }
    );


    /* =====================================================
       PREVENT CONTEXT MENU
       ===================================================== */

    document.addEventListener(
        "contextmenu",
        (event) => {

            if (presentationMode) {

                event.preventDefault();

            }

        }
    );


    /* =====================================================
       INITIALIZE
       ===================================================== */

    updateSlide();


    /* =====================================================
       DEBUG
       ===================================================== */

    console.log(
        `NatureVision aktif — ${slides.length} slide`
    );

});
/* =========================================================
   BEYCAN HERO 3D PARALLAX
========================================================= */

const hero = document.querySelector(".hero");
const product = document.querySelector("#product");
const cards = document.querySelectorAll(".floating-card");
const header = document.querySelector(".site-header");

let mouseX = 0;
let mouseY = 0;

let currentX = 0;
let currentY = 0;


/* =========================================================
   DESKTOP PARALLAX
========================================================= */

if (hero && product) {

    hero.addEventListener("mousemove", (event) => {

        const rect = hero.getBoundingClientRect();

        mouseX =
            ((event.clientX - rect.left) / rect.width - 0.5) * 2;

        mouseY =
            ((event.clientY - rect.top) / rect.height - 0.5) * 2;

    });


    hero.addEventListener("mouseleave", () => {

        mouseX = 0;
        mouseY = 0;

    });


    function animate() {

        currentX +=
            (mouseX - currentX) * 0.045;

        currentY +=
            (mouseY - currentY) * 0.045;


        /* Laptop + mobile */

        product.style.transform = `
            translate3d(
                ${currentX * 8}px,
                ${currentY * 5}px,
                0
            )
            rotateY(${currentX * 2}deg)
            rotateX(${-currentY * 1.5}deg)
        `;


        /* Floating cards */

        cards.forEach((card, index) => {

            const speed = (index + 1) * 1.5;

            card.style.translate =
                `${currentX * speed}px ${currentY * speed}px`;

        });


        requestAnimationFrame(animate);

    }

    animate();

}


/* =========================================================
   HEADER SCROLL
========================================================= */

window.addEventListener("scroll", () => {

    if (!header) return;

    if (window.scrollY > 20) {

        header.style.boxShadow =
            "0 8px 30px rgba(0,0,0,.10)";

    } else {

        header.style.boxShadow =
            "0 5px 25px rgba(0,0,0,.04)";

    }

});


/* =========================================================
   MOBILE MENU
========================================================= */

const menuButton =
    document.querySelector(".menu-button");

const nav =
    document.querySelector(".main-nav");


if (menuButton && nav) {

    menuButton.addEventListener("click", () => {

        nav.classList.toggle("mobile-open");

    });

}

/* =========================================================
   BEYCAN TECHNOLOGIES SLIDER
   Replace the old "HORIZONTAL AUTO SCROLL" block at the end of script.js with this.
========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    const slider = document.getElementById("techSlider");
    const track = document.getElementById("techTrack");
    const leftButton = document.querySelector(".tech-arrow-left");
    const rightButton = document.querySelector(".tech-arrow-right");
    const progress = document.getElementById("techProgress");

    if (!slider || !track) return;


    /* clone the cards once so the loop is seamless */

    Array.from(track.children).forEach(function (card) {
        const clone = card.cloneNode(true);
        clone.setAttribute("aria-hidden", "true");
        track.appendChild(clone);
    });


    let position = 0;
    let autoScroll = true;
    let loopWidth = 0;
    const speed = 0.45;
    const THUMB = 17;               /* progress thumb width in % */

    function measure() {
        const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
        loopWidth = (track.scrollWidth + gap) / 2;   /* width of one full set + its trailing gap */
    }

    measure();
    window.addEventListener("resize", measure);
    window.addEventListener("load", measure);


    function wrap() {
        if (!loopWidth) return;
        if (position >= loopWidth) position -= loopWidth;
        if (position < 0) position += loopWidth;
    }

    function render() {
        wrap();
        track.style.transform = "translate3d(" + (-position) + "px,0,0)";

        if (progress && loopWidth) {
            const ratio = position / loopWidth;                 /* 0 -> 1 */
            progress.style.left = (ratio * (100 - THUMB)) + "%";
            progress.style.width = THUMB + "%";
        }
    }


    function tick() {
        if (autoScroll) {
            position += speed;
            render();
        }
        requestAnimationFrame(tick);
    }

    tick();


    /* pause while hovering / touching, resume afterwards */

    let resumeTimer = null;

    function pause() {
        autoScroll = false;
        clearTimeout(resumeTimer);
    }

    function resume(delay) {
        clearTimeout(resumeTimer);
        resumeTimer = setTimeout(function () { autoScroll = true; }, delay || 0);
    }

    slider.addEventListener("mouseenter", pause);
    slider.addEventListener("mouseleave", function () { if (!dragging) resume(0); });


    /* arrows: move by one card */

    function step() {
        const card = track.querySelector(".tech-card");
        const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
        return card ? card.offsetWidth + gap : 170;
    }

    function slide(direction) {
        pause();
        position += direction * step();
        render();
        resume(1500);
    }

    if (rightButton) rightButton.addEventListener("click", function () { slide(1); });
    if (leftButton) leftButton.addEventListener("click", function () { slide(-1); });


    /* drag (mouse) + swipe (touch) */

    let dragging = false;
    let startX = 0;
    let startPosition = 0;

    function dragStart(x) {
        dragging = true;
        pause();
        startX = x;
        startPosition = position;
        slider.style.cursor = "grabbing";
    }

    function dragMove(x) {
        if (!dragging) return;
        position = startPosition - (x - startX);
        render();
    }

    function dragEnd() {
        if (!dragging) return;
        dragging = false;
        slider.style.cursor = "grab";
        resume(800);
    }

    slider.addEventListener("mousedown", function (e) { dragStart(e.clientX); e.preventDefault(); });
    window.addEventListener("mousemove", function (e) { dragMove(e.clientX); });
    window.addEventListener("mouseup", dragEnd);

    slider.addEventListener("touchstart", function (e) { dragStart(e.touches[0].clientX); }, { passive: true });
    slider.addEventListener("touchmove", function (e) { dragMove(e.touches[0].clientX); }, { passive: true });
    slider.addEventListener("touchend", dragEnd, { passive: true });

});
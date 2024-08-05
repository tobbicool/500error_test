function setupSlider() {
    const slider = document.querySelector(".infinite-slider__slider");
    const slides = Array.from(slider.querySelectorAll(".infinite-slider__slide"));
    const prevBtn = document.querySelector(".infinite-slider__prev");
    const nextBtn = document.querySelector(".infinite-slider__next");
    const totalSlides = slides.length;
    let currentIndex = 0;
    let startX, moveX;
    let isSwiping = false;
    let autoSlideTimer;

    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    function cloneSlides() {
        // Remove existing slides
        slider.innerHTML = '';

        // Shuffle the original slides
        shuffleArray(slides);

        // Add shuffled slides to the slider
        slides.forEach(slide => slider.appendChild(slide.cloneNode(true)));

        // Clone additional slides for infinite effect
        for (let i = 0; i < 6; i++) { // 6 is the amount of slides rendered on each side of the current slide. If changing it, also change in updateSliderPosition.
            slider.prepend(slides[totalSlides - 1 - i].cloneNode(true));
            slider.appendChild(slides[i].cloneNode(true));
        }
    }

    function updateSliderPosition(animate = true) {
        slider.style.transform = `translateX(-${(currentIndex + 6) * 100}%)`; // Here

        const allSlides = slider.querySelectorAll(".infinite-slider__slide");
        allSlides.forEach((slide, index) => {
            const position = index - (currentIndex + 6); // Here
            slide.setAttribute("data-position", position);
        });

        if (animate) {
            slider.classList.add("transitioning");
            allSlides.forEach((slide) => slide.classList.add("transitioning"));
        } else {
            slider.classList.remove("transitioning");
            allSlides.forEach((slide) => slide.classList.remove("transitioning"));
        }
    }

    function moveSlide(direction) {
        currentIndex += direction;
        updateSliderPosition();

        if (direction > 0 && currentIndex >= totalSlides) {
            setTimeout(() => {
                currentIndex = 0;
                updateSliderPosition(false);
            }, 300);
        } else if (direction < 0 && currentIndex < 0) {
            setTimeout(() => {
                currentIndex = totalSlides - 1;
                updateSliderPosition(false);
            }, 300);
        }

        resetAutoSlideTimer();
    }

    function handleSlideClick(e) {
        const clickedSlide = e.target.closest(".infinite-slider__slide");
        if (clickedSlide) {
            const position = parseInt(clickedSlide.getAttribute("data-position"));
            if (position === 0) {
                // Navigate to the link only if it's the current slide
                window.location.href = clickedSlide.getAttribute("data-href");
            } else {
                // Otherwise, just move the slider
                moveSlide(position);
            }
        }
    }

    function handleTouchStart(e) {
        startX = e.touches[0].clientX;
        isSwiping = true;
        resetAutoSlideTimer();
    }

    function handleTouchMove(e) {
        if (!isSwiping) return;
        moveX = e.touches[0].clientX;
        const diff = moveX - startX;
        slider.style.transform = `translateX(calc(-${(currentIndex + 6) * 100}% + ${diff}px))`;
    }

    function handleTouchEnd() {
        if (!isSwiping) return;
        isSwiping = false;
        const diff = moveX - startX;
        if (Math.abs(diff) > 50) {
            moveSlide(diff > 0 ? -1 : 1);
        } else {
            updateSliderPosition();
        }
    }

    function startAutoSlide() {
        autoSlideTimer = setInterval(() => {
            moveSlide(1);
        }, 6000);
    }

    function resetAutoSlideTimer() {
        clearInterval(autoSlideTimer);
        startAutoSlide();
    }

    function addEventListeners() {
        prevBtn.addEventListener("click", () => moveSlide(-1));
        nextBtn.addEventListener("click", () => moveSlide(1));
        slider.addEventListener("click", handleSlideClick);
        slider.addEventListener("touchstart", handleTouchStart, { passive: true });
        slider.addEventListener("touchmove", handleTouchMove, { passive: false });
        slider.addEventListener("touchend", handleTouchEnd, { passive: true });
    }

    cloneSlides();
    updateSliderPosition(false);
    addEventListeners();
    startAutoSlide();
}

// Run the setup function when the DOM is fully loaded
document.addEventListener("DOMContentLoaded", setupSlider);

// If using View Transitions, also run the setup when new content is swapped in
document.addEventListener("astro:after-swap", setupSlider);
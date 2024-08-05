document.addEventListener('DOMContentLoaded', () => {
    const sliderContainers = document.querySelectorAll('.slider-container');
    let lastWindowWidth = window.innerWidth;

    initializeSliders(sliderContainers);

    window.addEventListener('resize', () => {
        let currentWidth = window.innerWidth;
        if (currentWidth !== lastWindowWidth) {
            initializeSliders(sliderContainers);
            lastWindowWidth = currentWidth;
        }
    });
});

function initializeSliders(sliderContainers) {
    sliderContainers.forEach(container => {
        if (container.offsetParent === null) {
            return; // Skip the slider if it's not visible
        }

        const allSlides = Array.from(container.querySelectorAll('.slide'));
        const indicator = container.querySelector('.indicator');
        indicator.innerHTML = ''; // Clear existing dots

        // Validate slides and create dots
        const slidesValidity = allSlides.map(slide => {
            const paragraph = slide.querySelector('p');
            const isValid = paragraph && paragraph.textContent.trim() !== '';
            if (isValid) {
                const dot = document.createElement('span');
                dot.className = 'slider-dot';
                indicator.appendChild(dot);
            }
            return isValid;
        });

        let currentSlide = 0;
        const allDots = Array.from(indicator.querySelectorAll('.slider-dot'));

        let touchStartX = 0;  // Define touch variables in the slider container scope
        let touchEndX = 0;

        function updateSlider(newIndex) {
            const slidesContainer = container.querySelector('.slides');
            const slider = container.querySelector('.slider');

            slidesContainer.style.transform = `translateX(-${newIndex * 100}%)`;

            allDots.forEach((dot, idx) => {
                dot.classList.remove('active-slider-dot');
                if (idx === newIndex) {
                    dot.classList.add('active-slider-dot');
                }
            });

            let slideHeight = slidesValidity[newIndex] ? allSlides[newIndex].clientHeight : 0;
            slider.style.height = `${slideHeight}px`;

            currentSlide = newIndex;
            container.currentSlide = newIndex; // Update the container with the new current slide
        }

        // Initialize the slider with the first valid slide
        const firstValidIndex = slidesValidity.findIndex(isValid => isValid);
        if (firstValidIndex !== -1) {
            updateSlider(firstValidIndex);
        }

        // Event listeners for navigation
        container.querySelector('.prev').addEventListener('click', () => {
            const newIndex = findNextValidIndex(currentSlide, -1);
            updateSlider(newIndex);
        });

        container.querySelector('.next').addEventListener('click', () => {
            const newIndex = findNextValidIndex(currentSlide, 1);
            updateSlider(newIndex);
        });

        allDots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                updateSlider(index);
            });
        });

        allSlides.forEach((slide, index) => {
            slide.addEventListener('touchstart', e => {
                touchStartX = e.changedTouches[0].screenX;
            });

            slide.addEventListener('touchend', e => {
                touchEndX = e.changedTouches[0].screenX;
                handleSwipe();
            });
        });

        function findNextValidIndex(currentIndex, direction) {
            let newIndex = currentIndex;
            do {
                newIndex = (newIndex + direction + allSlides.length) % allSlides.length;
            } while (!slidesValidity[newIndex]);
            return newIndex;
        }

        function handleSwipe() {
            const swipeThreshold = 50;
            if (touchEndX + swipeThreshold < touchStartX) {
                const newIndex = findNextValidIndex(currentSlide, 1);
                updateSlider(newIndex);
            } else if (touchEndX - swipeThreshold > touchStartX) {
                const newIndex = findNextValidIndex(currentSlide, -1);
                updateSlider(newIndex);
            }
        }
    });
}

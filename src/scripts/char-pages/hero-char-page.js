//////// Scroll 100svh/vh when clicking arrow

document.addEventListener("DOMContentLoaded", function () {
    const arrows = document.querySelectorAll(".char-hero__arrow");

    arrows.forEach((arrow) => {
        arrow.addEventListener("click", scrollDown);
    });
});

function scrollDown(event) {
    event.preventDefault();

    const svh = Math.min(window.innerHeight, window.innerWidth);
    const vh = window.innerHeight || document.documentElement.clientHeight;
    const scrollAmount = svh || vh;

    window.scrollBy({
        top: scrollAmount,
        behavior: 'smooth'
    });
}
    


/////// Move the QuoteSlider outside the container when less than 1000px

    function moveQuoteSlider() {
        const quoteSlider = document.querySelector(".char-hero__quote-slider");
        const container = document.querySelector(".char-hero");
        const nameWrapper = document.querySelector(
            ".char-hero__text-section .char-hero__name-wrapper",
        );
        const containerParent = container.parentNode;

        if (window.innerWidth < 1000) {
            // Move the quote slider outside and below the container
            containerParent.insertBefore(quoteSlider, container.nextSibling);
        } else {
            // Move the quote slider back to its original position before the name wrapper
            nameWrapper.parentNode.insertBefore(quoteSlider, nameWrapper);
        }
    }

    window.addEventListener("resize", moveQuoteSlider);
    document.addEventListener("DOMContentLoaded", moveQuoteSlider);


    
    /////// Hide <li> if anchor's target does not exist
    function hideNonexistentAnchors() {
        const listItems = document.querySelectorAll('.char-hero__contents ul li');
        listItems.forEach((li) => {
            const targetId = li.getAttribute('data-target');
            const targetElement = document.getElementById(targetId);
            if (!targetElement) {
                li.style.display = 'none';
            }
        });
    }

    document.addEventListener('DOMContentLoaded', hideNonexistentAnchors);
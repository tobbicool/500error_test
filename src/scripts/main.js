
////////// Fade in

function fadeIn() {
    let elementsArray = document.querySelectorAll(".fade-in-left, .fade-in-right, .pop-in");
    elementsArray.forEach(function (elem) {
        // Check if the element already has the 'inView' class
        if (!elem.classList.contains("inView")) {
            var distInView = elem.getBoundingClientRect().top - window.innerHeight + 20;
            if (distInView < 0) {
                elem.classList.add("inView");
            }
        }
    });
}

function handleScroll() {
    fadeIn(); // Call the function on scroll
    let elementsArray = document.querySelectorAll(".fade-in-left, .fade-in-right, .pop-in");
    let allInView = true;
    // Check if all elements are in view
    elementsArray.forEach(function (elem) {
        if (!elem.classList.contains("inView")) {
            allInView = false;
        }
    });
    // Remove the scroll event listener if all elements are in view
    if (allInView) {
        window.removeEventListener('scroll', handleScroll);
    }
}

// Call fadeIn function on initial page load
fadeIn();

// Add the scroll event listener
window.addEventListener('scroll', handleScroll);

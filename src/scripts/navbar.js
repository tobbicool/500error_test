//////Hamburgermenu
const hamburgerWrapper = document.querySelector(".hamburger-wrapper");
const hamburger = document.querySelector(".hamburger");
const links = document.querySelector(".hamburger-nav");

hamburger.addEventListener("click", () => {
  hamburgerWrapper.classList.toggle("active");
  hamburger.classList.toggle("active");
  links.classList.toggle("active");

  checkScrollPosition();
})


document.querySelectorAll(".hamburger-link").forEach(n => n.
  addEventListener("click", () => {
    hamburgerWrapper.classList.remove("active");
    hamburger.classList.remove("active");
    links.classList.remove("active");
  }))

// Remove 'active' class when clicking outside of .hamburger-nav (side nav)
document.addEventListener("click", (event) => {
  const isClickInsideLinks = links.contains(event.target);
  const isClickInsideHamburger = hamburger.contains(event.target);

  if (!isClickInsideLinks && !isClickInsideHamburger) {
    hamburgerWrapper.classList.remove("active");
    hamburger.classList.remove("active");
    links.classList.remove("active");
  }

  checkScrollPosition();
});


// Hamburger hover animation, so it always finishes, even when cursor leaves the hamburger
let isAnimating = false;

hamburger.addEventListener("mouseover", function () {
  if (!isAnimating) {
    isAnimating = true;
    this.classList.add("animate");

    setTimeout(() => {
      this.classList.remove("animate");
      isAnimating = false;
    }, 900); // Duration of the longest animation
  }
});




////// On scroll transitions
function updateElements(className, scrollThreshold, cssClass) {
  var elements = document.getElementsByClassName(className);
  var scrollValue = window.scrollY;

  for (var i = 0; i < elements.length; i++) {
    if (scrollValue < scrollThreshold) {
      elements[i].classList.remove(cssClass);
    } else {
      elements[i].classList.add(cssClass);
    }
  }
}

function checkScrollPosition() {
  const scrollValue = window.scrollY;
  const isActive = hamburgerWrapper.classList.contains('active');

  updateElements('navColor', 70, 'navColorChange');
  updateElements('navbar__logo-text', 70, 'logoTextChange');
  updateElements('navWidth', 70, 'navWidthChange');
  updateElements('hamburgerSlide', 70, 'hamburgerSlideChange');

  var bars = document.querySelectorAll('.hamburger .hamburger__bar');
  var navTexts = document.querySelectorAll('.navText');
  var hoverLines = document.querySelectorAll('.hover-line');

  // Change hamburger bar color when navbar is visible, but not at the top and not when hamburger is active
  if (scrollValue > 70 && !isActive) {
    bars.forEach(bar => bar.classList.add('hamburgerColorVisible'));
  } else {
    bars.forEach(bar => bar.classList.remove('hamburgerColorVisible'));
  }

  // Change hamburger bar color when navbar is visible, but not at the top
  if (scrollValue > 70) {
    navTexts.forEach(text => text.classList.add('navTextVisible'));
    hoverLines.forEach(line => line.classList.add('hoverLineVisible'));
  } else {
    navTexts.forEach(text => text.classList.remove('navTextVisible'));
    hoverLines.forEach(line => line.classList.remove('hoverLineVisible'));
  }
}

// Check scroll position when the page is loaded
window.addEventListener('load', checkScrollPosition);

// Update elements on scroll
window.addEventListener('scroll', checkScrollPosition);





/////// Class on scroll up/down
var prevScrollPos = window.scrollY;
var lastScrollTime = new Date().getTime();

function moveUpDown() {
  var currentScrollPos = window.scrollY;
  var currentTime = new Date().getTime();
  var timeDiff = currentTime - lastScrollTime;
  var scrollSpeed = Math.abs(currentScrollPos - prevScrollPos) / timeDiff;

  // Speed thresholds for up/down and touchdevice/desktop
  var touchSpeedThreshold = 2;
  var touchDownSpeedThreshold = 1;
  var nonTouchSpeedThreshold = 3;
  var nonTouchDownSpeedThreshold = 1.5;

  var isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0;

  var speedThreshold = isTouchDevice ? touchSpeedThreshold : nonTouchSpeedThreshold;
  var downSpeedThreshold = isTouchDevice ? touchDownSpeedThreshold : nonTouchDownSpeedThreshold;

  var navElements = document.getElementsByClassName('moveUpDown');

  if (prevScrollPos < currentScrollPos && currentScrollPos > 20) {
    // Scrolling down and not within the top 20px
    if (scrollSpeed > downSpeedThreshold) {
      for (var i = 0; i < navElements.length; i++) {
        navElements[i].classList.add('move');
      }
    }
  } else {
    // Scrolling up or within the top 20px
    if (scrollSpeed > speedThreshold || currentScrollPos <= 20) {
      for (var i = 0; i < navElements.length; i++) {
        navElements[i].classList.remove('move');
      }
    }
  }

  prevScrollPos = currentScrollPos;
  lastScrollTime = currentTime;
}

window.addEventListener('scroll', function () {
  moveUpDown();
});




///// class when cursor is in top 70px
window.addEventListener('mousemove', function (e) {
  var navElements = document.getElementsByClassName('moveUpDown');
  if (e.clientY <= 70) {
    // Cursor is in the top 70px
    for (var i = 0; i < navElements.length; i++) {
      navElements[i].classList.remove('move');
    }
  }
});
document.addEventListener('DOMContentLoaded', (event) => {
  const sliderContainers = document.querySelectorAll(".important-events");
  let currentlyPlayingAudio = null;

  let minDragDistance = 0;

  function updateMinDragDistance() {
    const viewportWidth = window.innerWidth;
    const thirtyPercentOfViewport = viewportWidth * 0.3;
    minDragDistance = Math.min(thirtyPercentOfViewport, 300); // 30% of the viewport width or 300px, whichever is smaller
  }

  updateMinDragDistance();

  let dragStartTime;
  let lastWindowWidth = window.innerWidth;

  sliderContainers.forEach((container) => {
    let slideIndex = 0;
    let isDragging = false;
    let startX = 0;
    let startY = 0;
    let currentTranslate = 0;
    let prevTranslate = 0;
    let animationID = 0;
    let isVerticalScroll = false;
    let isDirectionLocked = false;

    const slides = container.querySelector(".slides");
    const slideArray = Array.from(container.querySelectorAll(".slide"));
    const dots = container.querySelectorAll(".ie-dot");

    const totalSlides = slideArray.length;

    function moveSlide(next) {
      slideIndex += next;
      if (slideIndex >= totalSlides) {
        slideIndex = 0;
      } else if (slideIndex < 0) {
        slideIndex = totalSlides - 1;
      }
      updateCarousel();
    }

    function currentSlide(index) {
      slideIndex = index;
      setPositionByIndex();
      updateCarousel();
    }

    function updateCarousel() {
      slides.style.transition = 'transform 0.3s ease-out, height 0.3s ease-out';
      slides.style.transform = `translateX(-${slideIndex * 100}%)`;
    
      // Update the active dot
      dots.forEach((dot, idx) => {
          dot.classList.remove("active-ie-dot");
          if (idx === slideIndex) {
              dot.classList.add("active-ie-dot");
          }
      });
    
      // Move the underline
      const activeDot = dots[slideIndex];
      const underline = container.querySelector(".underline");
      underline.style.transform = `translateX(${activeDot.offsetLeft}px)`;
    
      const currentSlide = slideArray[slideIndex];
      adjustSlideHeight(currentSlide);
    }
  

    function adjustSlideHeight(slide) {
      const images = slide.querySelectorAll('img');
      let loadedImages = 0;

      // Function to update height
      const setHeight = () => {
        const slideHeight = slide.clientHeight;
        slides.style.height = `${slideHeight}px`;
      };

      if (images.length > 0) {
        images.forEach(img => {
          if (img.complete && img.naturalHeight !== 0) {
            loadedImages++;
          } else {
            img.onload = () => {
              loadedImages++;
              if (loadedImages === images.length) {
                setHeight();
              }
            };
          }
        });

        // Check if all images were already loaded when checked
        if (loadedImages === images.length) {
          setHeight();
        }
      } else {
        // If no images, set height based on current content
        setHeight();
      }
    }

    // Add event listeners within the current container
    dots.forEach((dot, index) => {
      dot.addEventListener('click', () => currentSlide(index));
    });

    // Audio controls
    function updateButtonToPlay(button) {
      button.querySelector("#playIcon").style.display = "inline";
      button.querySelector("#pauseIcon").style.display = "none";
    }

    function stopAllAudios() {
      slideArray.forEach((slide) => {
        const audioPlayer = slide.querySelector(".audio-player");
        if (audioPlayer) {
          audioPlayer.pause();
          audioPlayer.currentTime = 0;
          const playButton = slide.querySelector("#playButton");
          if (playButton) {
            updateButtonToPlay(playButton);
          }
        }
      });
    }

    function toggleAudioPlayback(button, audio) {
      if (currentlyPlayingAudio && currentlyPlayingAudio !== audio) {
        stopAllAudios();
      }

      if (audio.paused) {
        audio.play();
        button.querySelector("#playIcon").style.display = "none";
        button.querySelector("#pauseIcon").style.display = "inline";
        currentlyPlayingAudio = audio;
      } else {
        audio.pause();
        updateButtonToPlay(button);
        currentlyPlayingAudio = null;
      }
    }

    slideArray.forEach((slide) => {
      const playButton = slide.querySelector("#playButton");
      const audioPlayer = slide.querySelector(".audio-player");
      if (playButton && audioPlayer) {
        playButton.addEventListener('click', () => toggleAudioPlayback(playButton, audioPlayer));
        audioPlayer.addEventListener('ended', () => {
          updateButtonToPlay(playButton);
          currentlyPlayingAudio = null;
        });
      }
    });

    updateCarousel(); // Initialize the carousel

    // Handle window resize to adjust carousel and update heights
    window.addEventListener('resize', () => {
      const currentWindowWidth = window.innerWidth;
      if (currentWindowWidth !== lastWindowWidth) {
        updateMinDragDistance();
        updateCarousel(); // Reinitialize the carousel if the window size changes
        const currentSlide = slideArray[slideIndex];
        adjustSlideHeight(currentSlide); // Ensure the height is adjusted on resize
        lastWindowWidth = currentWindowWidth;
      }
    });


    // Pause audio when tab is not active
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'hidden' && currentlyPlayingAudio) {
          currentlyPlayingAudio.pause();
          currentlyPlayingAudio = null;
          document.querySelectorAll("#playButton").forEach(updateButtonToPlay);
        }
      });
    }

    // Swipe handling for mobile devices with real-time tracking
    slides.addEventListener('touchstart', touchStart);
    slides.addEventListener('touchend', touchEnd);
    slides.addEventListener('touchmove', touchMove, { passive: false });    

    function touchStart(e) {
      isDragging = true;
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
      dragStartTime = Date.now();
      animationID = requestAnimationFrame(animation);
      slides.style.transition = 'none';
      isVerticalScroll = false; // Reset the direction tracking
      isDirectionLocked = false; // Reset the direction lock
    }
    
    function touchEnd() {
      isDragging = false;
      cancelAnimationFrame(animationID);
      if (!isVerticalScroll) {
        snapLogic();
        // Ensure underline updates on swipe
        const activeDot = dots[slideIndex];
        const underline = container.querySelector(".underline");
        underline.style.transform = `translateX(${activeDot.offsetLeft}px)`;
      }
    }
    
    function touchMove(e) {
      if (isDragging) {
        const currentX = e.touches[0].clientX;
        const currentY = e.touches[0].clientY;
        const diffX = currentX - startX;
        const diffY = currentY - startY;
    
        if (!isDirectionLocked) {
          if (Math.abs(diffY) > Math.abs(diffX)) {
            isVerticalScroll = true; // Mark as vertical scroll if vertical movement is greater
          }
          isDirectionLocked = true; // Lock the direction after the first significant move
        }
    
        if (!isVerticalScroll) {
          e.preventDefault(); // Prevent vertical scrolling
          currentTranslate = prevTranslate + diffX;
          slides.style.transform = `translateX(${currentTranslate}px)`;
          adjustSlideHeight(slideArray[Math.round(Math.abs(currentTranslate / window.innerWidth))]);
        }
      }
    }
    
    container.addEventListener('touchmove', touchMove, { passive: false });


    
    function setPositionByIndex() {
      const currentSlide = slideArray[slideIndex];
      adjustSlideHeight(currentSlide);

      currentTranslate = slideIndex * -window.innerWidth;
      prevTranslate = currentTranslate;
      slides.style.transition = 'transform 0.3s ease-out, height 0.3s ease-out';
      slides.style.transform = `translateX(${currentTranslate}px)`;

      // Update the active dot
      dots.forEach((dot, idx) => {
        dot.classList.remove("active-ie-dot");
        if (idx === slideIndex) {
          dot.classList.add("active-ie-dot");
        }
      });
    }

    function snapLogic() {
      const movedBy = currentTranslate - prevTranslate;
      const dragEndTime = Date.now();
      const dragDuration = dragEndTime - dragStartTime;
      const dragSpeed = Math.abs(movedBy) / dragDuration * 1000; // Speed in pixels per second

      let slideChanged = false;
      const minSpeed = 300; // Minimum speed in pixels per second to trigger slide change

      if (Math.abs(movedBy) > minDragDistance || dragSpeed > minSpeed) {
        // Check if the dragged distance is greater than the minimum or the speed exceeds the threshold
        if (movedBy < 0 && slideIndex < slideArray.length - 1) {
          slideIndex += 1;
          slideChanged = true;
        } else if (movedBy > 0 && slideIndex > 0) {
          slideIndex -= 1;
          slideChanged = true;
        }
      }

      if (slideChanged) {
        setPositionByIndex();
      } else {
        // Revert to the original position if the movement or speed was not enough
        currentTranslate = prevTranslate;
        slides.style.transform = `translateX(${currentTranslate}px)`;
        slides.style.transition = 'transform 0.3s ease-out, height 0.3s ease-out';
      }
    }

    function animation() {
      slides.style.transition = 'transform 0.3s ease-out, height 0.3s ease-out';
      slides.style.transform = `translateX(${currentTranslate}px)`;
      if (isDragging) requestAnimationFrame(animation);
    }
  });

  ///Toggle icon image to green when clicking checkbox
  const checkbox = document.getElementById('events-checkbox');
  const checkIcon = document.querySelector('.ie-dot #check-img');
  const uncheckedImagePath = '/media/icons/unchecked-icon.svg';
  const checkedImagePath = '/media/icons/checked-icon.svg';

  // Function to update the image based on the checkbox state
  function updateCheckboxImage() {
    if (checkbox.checked) {
      checkIcon.src = checkedImagePath;
    } else {
      checkIcon.src = uncheckedImagePath;
    }
  }

  // Add event listener to toggle image
  checkbox.addEventListener('change', updateCheckboxImage);

  // Check the checkbox state on load and set the image accordingly
  updateCheckboxImage();
});
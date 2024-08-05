////// Function to load timestamps from a JSON file
async function loadTimestamps(language, character) {
    const translationsFilePath = `/locales/${language}/character-${character}.json`;

    try {
        const response = await fetch(translationsFilePath);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data.timestamps;
    } catch (error) {
        console.error(`Error loading timestamps:`, error);
        return []; // Return an empty array in case of error
    }
}


// Function to get language from data attribute
function getLanguageFromData() {
    const swipeStoryElement = document.getElementById('swipe-story');
    return swipeStoryElement.getAttribute('data-current-lang');
}


document.addEventListener('DOMContentLoaded', async () => {

    const slider = document.getElementById('swipe-story-slider-container');
    const sliderContainer = slider.parentElement;
    const swipeStoryContainer = document.querySelector('.swipe-story');
    const buttonWrapper = document.querySelector('.swipe-story__button-wrapper');
    const audioPlayer = document.getElementById('audioPlayer');
    const playButton = document.getElementById('playButton');
    const playIcon = document.getElementById('playIcon');
    const pauseIcon = document.getElementById('pauseIcon');
    const dotsContainer = document.getElementById('swipe-story-dots-container');
    const slidesCount = document.querySelectorAll('.swipe-story__slide').length;
    const swipeGest = document.querySelector('.swipe-story__gesture');

    let timestamps = [];
    let isDragging = false;
    let dragging = false;
    let startPos = 0;
    let currentTranslate = 0;
    let prevTranslate = 0;
    let animationID = 0;
    let currentIndex = 0;
    let isPlaying = false;
    let playPromise = null;
    let touchDirectionLocked = null;
    let isPlayButtonPressed = false;
    let shouldUpdateAudio = false;
    let dragStartTime = 0;
    let dragSpeed = 0; // KEEP THIS ONE!
    let minDragDistance;


    // Load timestamps dynamically
    const swipeStoryElement = document.getElementById('swipe-story');
    const characterName = swipeStoryElement.getAttribute('data-character-name');
    const language = getLanguageFromData();
    const character = characterName;
    timestamps = await loadTimestamps(language, character);

    // Disable transition for initial setup
    slider.style.transition = 'none';

    // Center the first slide on initialization
    centerSlide();

    // Re-enable transition after initial setup
    setTimeout(() => {
        slider.style.transition = 'transform 0.7s ease';
    }, 0);

    function getPositionX(e) {
        return e.type.includes('mouse') ? e.clientX : e.touches[0].clientX;
    }

    function getPositionY(e) {
        return e.type.includes('mouse') ? e.clientY : e.touches[0].clientY;
    }

    function setSliderPosition() {
        slider.style.transform = `translateX(${currentTranslate}px)`;
        setSlidesPerspective();
    }

    function setSlidesPerspective() {
        const slides = document.querySelectorAll('.swipe-story__slide'); // Ensuring consistent class naming
        slides.forEach((slide, index) => {
            slide.className = 'swipe-story__slide'; // Reset classes correctly
            if (index < currentIndex) {
                slide.classList.add('previous');
            } else if (index > currentIndex) {
                slide.classList.add('next');
            } else {
                slide.classList.add('current');
            }
        });
    }


    function setupSlideEventHandlers() {
        const slides = document.querySelectorAll('.swipe-story__slide'); // Ensure class name matches what's in your HTML
        slides.forEach((slide, index) => {
            slide.removeEventListener('click', handleSlideClick); // Clear previous event handlers

            slide.addEventListener('click', () => {
                if (!dragging && index !== currentIndex) { // Ensure dragging is appropriately managed
                    handleSlideClick(index);
                }
            });
        });
    }


    function handleSlideClick(index) {
        if (index !== currentIndex) {
            currentIndex = index;
            shouldUpdateAudio = true; // Enable audio update since it's a direct user interaction
            setPositionByIndex();
        }
    }


    setupSlideEventHandlers();

    function mouseDown(e) {
        e.preventDefault();
        isDragging = true;
        startPos = getPositionX(e);
        dragStartTime = Date.now(); // Capture the start time of the drag
        animationID = requestAnimationFrame(animation);
        slider.classList.add('grabbing');
    }


    function mouseMove(e) {
        if (!isDragging) return;

        const currentPosition = getPositionX(e);
        const diffX = Math.abs(currentPosition - startPos);

        if (diffX > 10) { // Check for significant horizontal movement
            dragging = true;
            currentTranslate = prevTranslate + currentPosition - startPos;
            setSliderPosition();
        }
    }


    function mouseUp() {
        if (!isDragging) return;

        const dragEndTime = Date.now();
        const dragDuration = dragEndTime - dragStartTime;
        dragSpeed = Math.abs(currentTranslate - prevTranslate) / dragDuration * 1000; // Speed in pixels per second

        cancelAnimationFrame(animationID);
        isDragging = false;

        snapLogic(); // Call snap logic to decide if slide should change based on speed and drag distance
        slider.classList.remove('grabbing');
        setTimeout(() => {
            dragging = false; // Ensure dragging is reset after the UI has had time to update
        }, 0);
    }


    function startDrag(e) {
        isDragging = true;
        startPos = { x: getPositionX(e), y: getPositionY(e) };
        touchDirectionLocked = null;
        dragStartTime = Date.now(); // Capture the start time of the drag
        slider.classList.add('grabbing');
    }


    function drag(e) {
        if (!isDragging) return;

        const currentPosition = { x: getPositionX(e), y: getPositionY(e) };
        const diffX = Math.abs(currentPosition.x - startPos.x);
        const diffY = Math.abs(currentPosition.y - startPos.y); // Define diffY to fix the reference error

        // Determine and lock the direction if not already done
        if (!touchDirectionLocked) {
            touchDirectionLocked = diffX > diffY ? 'horizontal' : 'vertical';
        }

        // Only proceed if the locked direction is horizontal and movement is significant
        if (touchDirectionLocked === 'horizontal' && diffX > 10) {
            dragging = true;
            currentTranslate = prevTranslate + currentPosition.x - startPos.x;
            setSliderPosition();
            e.preventDefault();  // Prevent default action to stop vertical scroll when dragging horizontally
        }
    }





    function endDrag() {
        if (!isDragging) return;

        const dragEndTime = Date.now();
        const dragDuration = dragEndTime - dragStartTime;
        dragSpeed = Math.abs(currentTranslate - prevTranslate) / dragDuration * 1000; // Speed in pixels per second

        cancelAnimationFrame(animationID);
        isDragging = false;

        if (dragging && touchDirectionLocked === 'horizontal') {
            snapLogic();
        } else {
            currentTranslate = prevTranslate;
            setSliderPosition();
        }

        touchDirectionLocked = null;
        slider.classList.remove('grabbing');
        dragging = false;
    }



    function animation() {
        setSliderPosition();
        if (isDragging) requestAnimationFrame(animation);
    }

    function centerSlide() {
        setPositionByIndex();
    }


    //////// Audio scrubber functionality
    function setPositionByIndex() {
        const sliderWidth = slider.offsetWidth;
        const containerWidth = sliderContainer.offsetWidth;
        const offset = (containerWidth - sliderWidth) / 2;
        currentTranslate = currentIndex * -sliderWidth + offset;
        prevTranslate = currentTranslate;
        setSliderPosition();
        updateButtonPosition();
        updateDots();

        if (shouldUpdateAudio) {
            updateAudioPosition();
            updateButtonPosition();
            shouldUpdateAudio = false;
        }
    }


    function updateMinDragDistance() {
        const viewportWidth = window.innerWidth;
        const thirtyPercentOfViewport = viewportWidth * 0.3;
        minDragDistance = Math.min(thirtyPercentOfViewport, 300); // 30% of the viewport width or 300px, whichever is smaller
    }

    updateMinDragDistance();

    function snapLogic() {
        const movedBy = currentTranslate - prevTranslate;
        const dragEndTime = Date.now();
        const dragDuration = dragEndTime - dragStartTime;
        const dragSpeed = Math.abs(movedBy) / dragDuration * 1000; // Speed in pixels per second

        let slideChanged = false;
        const minSpeed = 300; // Minimum speed in pixels per second to trigger slide change

        if (Math.abs(movedBy) > minDragDistance || dragSpeed > minSpeed) {
            // Check if the dragged distance is greater than the minimum or the speed exceeds the threshold
            if (movedBy < 0 && currentIndex < slider.children.length - 1) {
                currentIndex += 1;
                slideChanged = true;
            } else if (movedBy > 0 && currentIndex > 0) {
                currentIndex -= 1;
                slideChanged = true;
            }
        }

        if (slideChanged) {
            setPositionByIndex();
            // Update button position only if moving between the first and second slides
            if (currentIndex === 0 || currentIndex === 1) {
                updateButtonPosition();
            }
            if (isPlayButtonPressed) {
                updateAudioPosition();
            }
        } else {
            // Revert to the original position if the movement or speed was not enough
            currentTranslate = prevTranslate;
            setSliderPosition();
        }
    }





    ///// Play Button
    playButton.addEventListener('click', () => {
        shouldUpdateAudio = true; // Enable audio update on play
        togglePlayback();
    });

    audioPlayer.addEventListener('timeupdate', () => {
        if (audioPlayer.currentTime >= timestamps[currentIndex + 1] && currentIndex < timestamps.length - 1) {
            currentIndex++;
            setPositionByIndex();
        }
        if (audioPlayer.currentTime >= audioPlayer.duration) {
            audioPlayer.pause();
            audioPlayer.currentTime = 0;
            playIcon.style.display = 'block'; // Show play icon
            pauseIcon.style.display = 'none'; // Hide pause icon
            isPlaying = false;
        }
    });

    function togglePlayback() {
        if (audioPlayer.paused) {
            playPromise = audioPlayer.play();
            playPromise.then(() => {
                playIcon.style.display = 'none';
                pauseIcon.style.display = 'block';
                isPlaying = true;
                isPlayButtonPressed = true; // Set the flag when play is initiated
                // Check current slide and scrub to that position before playing
                updateAudioPosition();
            }).catch((error) => {
                console.error('Error attempting to play audio:', error);
            });
        } else {
            if (playPromise !== null) {
                playPromise.then(() => {
                    audioPlayer.pause();
                    playIcon.style.display = 'block';
                    pauseIcon.style.display = 'none';
                    isPlaying = false;
                }).catch((error) => {
                    console.error('Error after playing audio:', error);
                });
            }
        }
    }


    function updateAudioPosition() {
        if (currentIndex < timestamps.length && isPlayButtonPressed) {
            const time = timestamps[currentIndex];
            audioPlayer.currentTime = time;
            // audioPlayer.volume = currentIndex === 0 ? 0 : 1;  // Turn down volume (mute) for the first slide //Seems to be troublesome. When going back the first slide, the audio is muted until further interaction.
            if (isPlaying && audioPlayer.paused) {
                audioPlayer.play().catch((error) => {
                    console.error('Failed to play after setting position:', error);
                });
            }
        }
    }




    // Ensure the correct image is shown when the page loads
    if (audioPlayer.paused) {
        playIcon.style.display = 'block';
        pauseIcon.style.display = 'none';
    } else {
        playIcon.style.display = 'none';
        pauseIcon.style.display = 'block';
    }


    function updateButtonPosition() {
        // Check if the current index is 0 or 1 to update the position between the first and second slides only
        if (currentIndex === 0 || currentIndex === 1) {
            if (currentIndex === 0) {
                // Move the button inside the slider only if it's currently outside
                if (playButton.classList.contains('outside-slider')) {
                    playButton.classList.remove('outside-slider');
                    buttonWrapper.classList.remove('outside-slider');
                    dotsContainer.classList.remove('outside-slider');
                    slider.querySelector('.swipe-story__slide:first-of-type .swipe-story__button-wrapper').appendChild(playButton);
                }
            } else {
                // Move the button outside only if it's currently inside
                if (!playButton.classList.contains('outside-slider')) {
                    playButton.classList.add('outside-slider');
                    buttonWrapper.classList.add('outside-slider');
                    dotsContainer.classList.add('outside-slider');
                    swipeStoryContainer.appendChild(playButton);
                }
            }
        }
    }


    ////// Nav dots
    for (let i = 0; i < slidesCount; i++) {
        const dot = document.createElement('div');
        dot.classList.add('swipe-story__dot');
        if (i === 0) dot.classList.add('active'); // Set the first dot as active initially
        dot.addEventListener('click', () => changeSlide(i)); // Add event listener to change slide on click
        dotsContainer.appendChild(dot);
    }

    function updateDots() {
        const dots = document.querySelectorAll('.swipe-story__dot');
        dots.forEach((dot, index) => {
            if (index === currentIndex) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
    }


    // Handle slide change on navigation or scrubbing
    function changeSlide(newIndex) {
        currentIndex = newIndex;
        shouldUpdateAudio = true;
        setPositionByIndex();
        updateDots();
    }
    




    //////// Stop audio when tabbing out on mobile
    function isMobileDevice() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }

    // Define visibility change handler function
    function handleVisibilityChange() {
        if (document.visibilityState === 'hidden' && isPlaying) {
            audioPlayer.pause();
            isPlaying = false;
            playButton.innerText = 'Play';
        }
    }

    // Apply event listener for visibility change only if on a mobile device
    if (isMobileDevice()) {
        document.addEventListener('visibilitychange', handleVisibilityChange);
    }




    //////// Hide swipe gesture when clicked/tapped, and only show the first time
    function hideSwipeGest() {
        swipeGest.style.display = 'none';
        localStorage.setItem('swipeGestHidden', 'true'); // Store the state in localStorage
    }

    // Check if swipe gesture was already hidden
    if (localStorage.getItem('swipeGestHidden') !== 'true') {
        // Function to handle release event and hide swipe gesture
        function onRelease() {
            hideSwipeGest();
            window.removeEventListener('mouseup', onRelease);
            window.removeEventListener('touchend', onRelease);
        }

        swipeGest.addEventListener('mousedown', () => {
            window.addEventListener('mouseup', onRelease);
            window.addEventListener('touchend', onRelease);
        });

        swipeGest.addEventListener('touchstart', () => {
            window.addEventListener('mouseup', onRelease);
            window.addEventListener('touchend', onRelease);
        });

        // Also add listeners to ensure swipe gesture hides on movement and release
        swipeGest.addEventListener('mousemove', () => {
            window.addEventListener('mouseup', onRelease);
            window.addEventListener('touchend', onRelease);
        });

        swipeGest.addEventListener('touchmove', () => {
            window.addEventListener('mouseup', onRelease);
            window.addEventListener('touchend', onRelease);
        });
    } else {
        hideSwipeGest(); // Hide immediately if previously hidden
    }





    setupSlideEventHandlers();
    setSlidesPerspective();
    setPositionByIndex();


    window.addEventListener('resize', () => {
        updateMinDragDistance(); // Update on window resize
        shouldUpdateAudio = false; // Prevent audio update on resize
        setPositionByIndex(); // Adjust the slide position based on new conditions
    });

    sliderContainer.addEventListener('mousedown', mouseDown);
    window.addEventListener('mouseup', mouseUp);
    window.addEventListener('mousemove', mouseMove);

    sliderContainer.addEventListener('touchstart', startDrag, { passive: false });
    window.addEventListener('touchend', endDrag);
    window.addEventListener('touchmove', drag, { passive: false });

    setupSlideEventHandlers();  // Set up click handlers after the DOM is loaded
    setSlidesPerspective();
});
function initializeSwipeScroll() {
    const sugCardsContainer = document.querySelector('.sug-cards-wrapper');
    let isDown = false;
    let startX;
    let scrollLeft;
    let isDragging = false;
    let lastX;
    let velocity = 0;
    let rafId = null;

    // Mouse down event
    sugCardsContainer.addEventListener('mousedown', (e) => {
        isDown = true;
        startX = e.pageX;
        scrollLeft = sugCardsContainer.scrollLeft;
        lastX = e.pageX;
        velocity = 0;
        isDragging = false;
        sugCardsContainer.style.cursor = 'grabbing';
        e.preventDefault();
        if (rafId) {
            cancelAnimationFrame(rafId);
        }
    });

    // Mouse move event
    window.addEventListener('mousemove', (e) => {
        if (!isDown) return;

        const x = e.pageX;
        const deltaX = x - lastX;
        lastX = x;

        isDragging = true; // Detect any movement as a drag
        velocity = deltaX;
        const walk = (x - startX) * 1; // Adjust scroll speed
        sugCardsContainer.scrollLeft = scrollLeft - walk;

        e.preventDefault();
    });

    // Mouse up event
    window.addEventListener('mouseup', () => {
        if (!isDown) return;
        isDown = false;
        sugCardsContainer.style.cursor = '';
        if (isDragging) {
            glide();
        }
    });

    // Glide effect
    function glide() {
        if (Math.abs(velocity) < 0.5) {
            rafId = null;
            return;
        }

        sugCardsContainer.scrollLeft -= velocity;
        velocity *= 0.95; // Apply friction to slow down
        rafId = requestAnimationFrame(glide);
    }

    // Click event handler
    sugCardsContainer.addEventListener('click', (e) => {
        if (isDragging) {
            e.preventDefault();
            e.stopPropagation();
        }
    }, true);
}

// Initialize the swipe scroll
initializeSwipeScroll();




////// Shuffle cards, but within the first four cards, there should always be at least two cards with class 'nt'
function shuffleCards() {
    const sugCardsContainer = document.querySelector('.sug-cards-wrapper');
    let cards = Array.from(sugCardsContainer.children);
    let ntCards = cards.filter(card => card.classList.contains('nt'));
    let otherCards = cards.filter(card => !card.classList.contains('nt'));

    // Shuffle the arrays
    ntCards = shuffleArray(ntCards);
    otherCards = shuffleArray(otherCards);

    // Ensure at least two 'nt' cards are in the first four positions
    while (ntCards.length < 2) {
        ntCards.push(otherCards.shift());
    }

    // Combine and shuffle the first four cards, then append the rest
    let firstFourCards = shuffleArray([...ntCards.splice(0, 2), ...otherCards.splice(0, 2)]);
    let shuffledCards = [...firstFourCards, ...ntCards, ...otherCards];

    // Append shuffled cards back to the container
    sugCardsContainer.innerHTML = '';
    shuffledCards.forEach(card => sugCardsContainer.appendChild(card));
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Initialize the swipe scroll and shuffle cards
initializeSwipeScroll();
shuffleCards(); // Call this function to shuffle cards on page load

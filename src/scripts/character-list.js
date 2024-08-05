document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('searchFilterInput');
    const searchButton = document.getElementById('searchButton');
    const mostRenownedBtn = document.getElementById('mostRenownedBtn');
    const newTestamentBtn = document.getElementById('newTestamentBtn');
    const oldTestamentBtn = document.getElementById('oldTestamentBtn');

    const characterElements = Array.from(document.querySelectorAll('.character-list__card'));
    const characters = characterElements.map(character => ({
        element: character,
        name: character.querySelector('.character-list__header').innerText,
        description: character.querySelector('.character-list__description').innerText,
        isRenowned: character.dataset.renowned === 'true',
        testament: character.dataset.testament
    }));

    const fuse = new Fuse(characters, {
        keys: ['name', 'description'],
        threshold: 0.3
    });

    let lastSearchQuery = '';

    const filterCharacters = () => {
        const searchQuery = searchInput.value.toLowerCase();
        const mostRenowned = mostRenownedBtn.classList.contains('active');
        const ntActive = newTestamentBtn.classList.contains('active');
        const otActive = oldTestamentBtn.classList.contains('active');
        const testamentFilter = ntActive && otActive ? 'BOTH' : ntActive ? 'NT' : otActive ? 'OT' : '';

        const result = searchQuery ? fuse.search(searchQuery).map(result => result.item) : characters;

        characterElements.forEach(character => character.style.display = 'none');

        result.forEach(character => {
            const matchesRenowned = !mostRenowned || character.isRenowned;
            const matchesTestament = !testamentFilter || testamentFilter === 'BOTH' || character.testament === testamentFilter || character.testament === 'BOTH';

            if (matchesRenowned && matchesTestament) {
                character.element.style.display = '';
            }
        });
    };

    searchInput.addEventListener('input', () => {
        const searchQuery = searchInput.value.toLowerCase();
        if (searchQuery !== lastSearchQuery) {
            lastSearchQuery = searchQuery;
            mostRenownedBtn.classList.remove('active');
            newTestamentBtn.classList.remove('active');
            oldTestamentBtn.classList.remove('active');
        }
        filterCharacters();
    });

    searchButton.addEventListener('click', () => {
        if (searchInput.value.trim() === '') {
            searchInput.focus();
        } else {
            filterCharacters();
        }
    });

    mostRenownedBtn.addEventListener('click', () => {
        mostRenownedBtn.classList.toggle('active');
        filterCharacters();
    });

    newTestamentBtn.addEventListener('click', () => {
        if (newTestamentBtn.classList.contains('active')) {
            newTestamentBtn.classList.remove('active');
        } else {
            newTestamentBtn.classList.add('active');
            oldTestamentBtn.classList.remove('active');
        }
        filterCharacters();
    });

    oldTestamentBtn.addEventListener('click', () => {
        if (oldTestamentBtn.classList.contains('active')) {
            oldTestamentBtn.classList.remove('active');
        } else {
            oldTestamentBtn.classList.add('active');
            newTestamentBtn.classList.remove('active');
        }
        filterCharacters();
    });
});

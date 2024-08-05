///////// IMPORTANT
// More characters should be added to the JSON files at: locales/*lang*/char-info.json
// More languages have to be added in getLanguageFromURL


/////// Dynamic translation:
let fuse;
let translations = {};

// Function to extract language code from URL
function getLanguageFromURL() {
    const urlPath = window.location.pathname;
    const segments = urlPath.split('/');
    const languageCode = segments[1];
    
    // List of known non-default language codes
    const knownLanguages = ['no', 'fr', 'de']; // Add other language codes as needed
    return knownLanguages.includes(languageCode) ? languageCode : 'default';
}

// Function to load JSON file based on language

function loadLanguageFile(languageCode) {
    const filePath = languageCode === 'default' ? '/locales/en/char-info.json' : `/locales/${languageCode}/char-info.json`;

    return fetch(filePath)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            translations = data.translations || {}; // Extract translations
            return data;
        })
        .catch(error => {
            console.error('Error loading language file:', error);
            return {}; // Return an empty object in case of an error
        });
}

document.addEventListener('DOMContentLoaded', initializeSearchData);

// Function to initialize search bar events for each search bar instance
function initializeSearchData() {
    const searchBars = document.querySelectorAll('.search-bar');
    searchBars.forEach(searchBar => {
        const searchInput = searchBar.querySelector('.searchInput');
        const searchButton = searchBar.querySelector('.searchButton');
        const resultsContainer = searchBar.querySelector('.resultsContainer');
        let currentIndex = -1;
        let fuse;

        // Load the search data
        const languageCode = getLanguageFromURL();
        loadLanguageFile(languageCode).then(data => {
            const links = Object.values(data.characters || {}).map(character => ({
                name: character.name,
                url: character.url,
                testament: character.testament
            }));

            if (languageCode !== 'default') {
                links.forEach(link => {
                    link.url = `/${languageCode}${link.url}`;
                });
            }
            fuse = new Fuse(links, { keys: ['name'] });
        });

        // Event listener for search input
        searchInput.addEventListener('input', function (event) {
            currentIndex = -1; 
            const searchTerm = event.target.value;
            if (fuse) {
                const results = fuse.search(searchTerm);
                displayResults(results.map((result) => result.item), resultsContainer);
            }
        });

        // Event listener for search button
        searchButton.addEventListener('click', function () {
            const results = resultsContainer.querySelectorAll('.result-item');
            if (results.length > 0) {
                results[0].querySelector('a').click();
            }
        });

        // Event listener for keyboard navigation
        document.addEventListener('keydown', function (event) {
            const results = resultsContainer.querySelectorAll('.result-item');
            const max = results.length;
            const isInputFocused = document.activeElement === searchInput;

            if (isInputFocused) {
                if (event.key === 'ArrowDown') {
                    event.preventDefault();
                    currentIndex = (currentIndex + 1) % max;
                    updateHighlight(results, currentIndex);
                } else if (event.key === 'ArrowUp') {
                    event.preventDefault();
                    currentIndex = (currentIndex - 1 + max) % max;
                    updateHighlight(results, currentIndex);
                } else if (event.key === 'Enter' && results.length > 0) {
                    event.preventDefault();
                    if (currentIndex >= 0) {
                        results[currentIndex].querySelector('a').click();
                    } else {
                        results[0].querySelector('a').click();
                    }
                }
            }
        });

        // Event listener to close search results when clicking outside
        document.addEventListener('click', function (event) {
            if (!searchInput.contains(event.target) && !resultsContainer.contains(event.target)) {
                resultsContainer.style.display = 'none';
            }
        });
    });
}

// Function to display search results + styles
function displayResults(results, container) {
    container.innerHTML = "";

    if (results.length === 0) {
        const noResultsElement = document.createElement('p');
        noResultsElement.textContent = translations.noResults || 'No results found';
        noResultsElement.classList.add('no-results');
        container.appendChild(noResultsElement);
        return;
    } else {
        container.style.display = 'block';
    }

    results.forEach((item, index) => {
        if (item && item.url && item.name && item.testament) {
            const element = document.createElement('div');
            element.classList.add('result-item');
            element.setAttribute('data-index', index);
            element.innerHTML = `
                <a href="${item.url}" class="result-link">${item.name}<span class="custom-text">${item.testament}</span></a>
            `;
            container.appendChild(element);
        }
    });
}

// Function to update highlight of selected item
function updateHighlight(results, currentIndex) {
    results.forEach((el) => {
        el.classList.remove('highlighted');
    });

    if (results[currentIndex]) {
        results[currentIndex].classList.add('highlighted');
    }
}

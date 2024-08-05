// Save progress to local storage
function saveProgress(characterId, checkedStates) {
    if (localStorage.getItem('consentSaveCharacters') === 'true') {
        localStorage.setItem(characterId, JSON.stringify(checkedStates));
    }
}

// Retrieve progress from local storage
function getProgress(characterId) {
    if (localStorage.getItem('consentSaveCharacters') === 'true') {
        const checkedStates = localStorage.getItem(characterId);
        return checkedStates ? JSON.parse(checkedStates) : {};
    }
    return {};
}

function updateProgress(characterId) {
    const characterElement = document.getElementById(characterId);
    const checkboxes = characterElement.querySelectorAll('input[type="checkbox"]');
    let checkedCount = 0;
    let checkedStates = {};

    checkboxes.forEach((checkbox) => {
        checkedStates[checkbox.id] = checkbox.checked;
        if (checkbox.checked) {
            checkedCount++;
        }
    });

    const progress = (checkedCount / checkboxes.length) * 100;
    saveProgress(characterId, checkedStates);

    const progressPercentage = progress.toFixed(0) + '%';
    document.getElementById('progress-' + characterId + '-text').innerText = progressPercentage;
    document.getElementById('progress-' + characterId + '-bar').style.width = progressPercentage;
}

// Initialize the progress when the page loads
document.addEventListener("DOMContentLoaded", () => {
    const characterElement = document.querySelector('[data-character-name]');
    const characterId = characterElement.dataset.characterName; ////// Dynamic ID (see layout CharacterPages.astro), so it works for all characters (no translation needed)
    const checkboxes = characterElement.querySelectorAll('input[type="checkbox"]');
    const checkedStates = getProgress(characterId);

    checkboxes.forEach((checkbox) => {
        checkbox.checked = checkedStates[checkbox.id] || false;

        // Add event listener to each checkbox
        checkbox.addEventListener("change", () => {
            // Trigger the animation
            const progressWrapper = document.getElementById('char-page-progress');
            progressWrapper.style.animation = 'none'; // Reset animation to ensure it runs each time
            setTimeout(() => {
                progressWrapper.style.animation = 'progressAnimation 0.5s ease';
            }, 0);

            updateProgress(characterId);
        });
    });

    updateProgress(characterId);
});
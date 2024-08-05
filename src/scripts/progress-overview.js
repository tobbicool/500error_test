// Retrieve progress from local storage
function getProgress(characterId) {
    const checkedStates = localStorage.getItem(characterId);
    return checkedStates ? JSON.parse(checkedStates) : {};
}

// Function to calculate and display the progress
function updateProgress(characters) {
    let totalCheckedCount = 0;
    let totalItemsCount = 0;

    characters.forEach(characterId => {
        const checkedStates = getProgress(characterId);
        const totalItems = Object.keys(checkedStates).length;
        const checkedCount = Object.values(checkedStates).filter(state => state).length;
        totalCheckedCount += checkedCount;
        totalItemsCount += totalItems;
    });

    // Calculate overall progress percentage
    const overallProgressPercentage = totalItemsCount > 0 ? (totalCheckedCount / totalItemsCount) * 100 : 0;
    const overallProgressText = overallProgressPercentage.toFixed(0) + '%';

    // Update the overall progress display
    const progressText = document.getElementById('overall-progress-text');
    const circle = document.getElementById('overall-progress-circle');
    
    if (progressText) {
        progressText.innerText = overallProgressText;
    }
    
    if (circle) {
        circle.classList.add('overall-progress-circle');
        circle.style.setProperty('--progress', overallProgressPercentage + '%');
    }
}

// Export the updateProgress function
if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = { updateProgress };
} else {
    window.updateProgress = updateProgress;
}

// Initialize progress when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    fetch('../../locales/en/char-info.json')
        .then(response => response.json())
        .then(data => {
            const characterIds = Object.keys(data.characters);
            updateProgress(characterIds);
        })
        .catch(error => console.error('Error loading the characters:', error));
});
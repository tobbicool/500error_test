// Function to load questions and translations from JSON files
async function loadQuestionsAndTranslations(language, character) {
    const questionsFilePath = `/locales/${language}/character-${character}-questions.json`;
    const translationsFilePath = `/locales/${language}/character-${character}.json`;

    try {
        const questionsResponse = await fetch(questionsFilePath);
        const translationsResponse = await fetch(translationsFilePath);

        if (!questionsResponse.ok || !translationsResponse.ok) {
            throw new Error(`HTTP error! status: ${questionsResponse.status} or ${translationsResponse.status}`);
        }

        const questions = await questionsResponse.json();
        const translations = await translationsResponse.json();

        return { questions, translations };
    } catch (error) {
        console.error(`Error loading questions and translations:`, error);
        throw error;
    }
}


// Function to extract language code from URL
function getLanguageFromURL() {
    const urlPath = window.location.pathname;
    const segments = urlPath.split('/');
    const languageCode = segments[1];

    /////// IMPORTANT: List of known non-default language codes
    const knownLanguages = ['no', 'fr', 'de']; // Add other language codes as needed
    return knownLanguages.includes(languageCode) ? languageCode : 'en'; // Default
}




document.addEventListener('DOMContentLoaded', async () => {
    const quizElement = document.getElementById('quiz');
    const characterName = quizElement.getAttribute('data-character-name');
    const currentLanguage = getLanguageFromURL();
    const currentCharacter = characterName;

    let allQuestions, translations;
    try {
        const data = await loadQuestionsAndTranslations(currentLanguage, currentCharacter);
        allQuestions = data.questions;
        translations = data.translations;
    } catch (error) {
        console.error("Error loading questions and translations:", error);
        return;
    }

    function getRandomQuestions(sourceArray, maxElements) {
        const totalQuestions = sourceArray.length;
        const neededElements = Math.min(totalQuestions, maxElements); // Choose the lesser of total questions or 15
        const arrayCopy = [...sourceArray];
        let result = [];

        for (let i = 0; i < neededElements; i++) {
            let index = Math.floor(Math.random() * arrayCopy.length);
            result.push(arrayCopy[index]);
            arrayCopy.splice(index, 1);
        }

        return result;
    }


    let questions = getRandomQuestions(allQuestions, 15); // Max amount of questions selected from the pool in the JSON files
    let currentQuestionIndex = 0;
    let score = 0;
    let answerSelected = false;

    const quizContainer = document.getElementById('quiz-questions');
    const questionNumber = document.getElementById('question-number');
    const questionText = document.getElementById('question-text');
    const options = document.querySelectorAll('.option-button');
    const nextButton = document.getElementById('next-button');
    const quizResultContainer = document.getElementById('quiz-result');
    const resultText = document.getElementById('result-text');
    const retryButton = document.getElementById('retry-button');
    const retryButtonPerfect = document.getElementById('retry-button-perfect');
    const everythingCorrectDiv = document.getElementById('everything-correct');

    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    function updateCorrectAnswerIndex(question) {
        let correctAnswer = question.options[question.answer];
        shuffleArray(question.options);
        question.answer = question.options.indexOf(correctAnswer);
    }

    function displayQuestion() {
        resetAnimations();
        answerSelected = false;
        quizContainer.classList.remove('answered');

        let currentQuestion = questions[currentQuestionIndex];
        updateCorrectAnswerIndex(currentQuestion);

        // Use translations for dynamic text
        questionNumber.textContent = translations.quizQuestionText
            .replace('{current}', currentQuestionIndex + 1)
            .replace('{total}', questions.length);
        questionText.textContent = currentQuestion.question;

        options.forEach((option, index) => {
            option.textContent = currentQuestion.options[index];
            option.classList.remove('correct', 'wrong');
            option.disabled = false;
            option.onclick = () => checkAnswer(index);
        });
    }

    function checkAnswer(selectedIndex) {
        if (answerSelected) return;
        answerSelected = true;

        // Add a class to indicate an answer has been selected
        quizContainer.classList.add('answered');

        const correctIndex = questions[currentQuestionIndex].answer;
        options.forEach((option, index) => {
            option.disabled = true;
            if (index === correctIndex) {
                option.classList.add('correct', 'scale');
            } else if (selectedIndex === index) {
                option.classList.add('wrong', 'shake');
            }
        });

        if (selectedIndex === correctIndex) {
            score++;
        }
    }

    function resetAnimations() {
        options.forEach(option => {
            option.classList.remove('correct', 'wrong', 'shake', 'scale');
        });
    }

    function showResults() {
        quizContainer.style.display = 'none';
        
        if (score === questions.length) {
            quizResultContainer.style.display = 'none';
            everythingCorrectDiv.style.display = 'flex';
            const celebrationImage = document.getElementById('celebration-image');
            celebrationImage.classList.remove('hidden');
            // Reset the animation
            celebrationImage.style.animation = 'none';
            celebrationImage.offsetHeight; // Trigger reflow
            celebrationImage.style.animation = null;
        } else {
            quizResultContainer.style.display = 'flex';
            everythingCorrectDiv.style.display = 'none';
            resultText.textContent = translations.quizScoreText
                .replace('{score}', score)
                .replace('{total}', questions.length);
        }
    }

    function restartQuiz() {
        currentQuestionIndex = 0;
        score = 0;
        questions = getRandomQuestions(allQuestions, questions.length);
        displayQuestion();
        quizContainer.style.display = 'grid';
        quizResultContainer.style.display = 'none';
        everythingCorrectDiv.style.display = 'none';
        resetAnimations();
        document.getElementById('celebration-image').classList.add('hidden');
    }

    retryButton.addEventListener('click', restartQuiz);
    retryButtonPerfect.addEventListener('click', restartQuiz);

    nextButton.addEventListener('click', () => {
        if (currentQuestionIndex < questions.length - 1) {
            currentQuestionIndex++;
            displayQuestion();
        } else {
            showResults();
        }
    });

    retryButton.addEventListener('click', () => {
        currentQuestionIndex = 0;
        score = 0;
        questions = getRandomQuestions(allQuestions, questions.length);
        displayQuestion();
        quizContainer.style.display = 'grid';
        quizResultContainer.style.display = 'none';
        resetAnimations();
    });



    displayQuestion();
});
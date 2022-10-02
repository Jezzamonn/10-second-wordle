const allLetters = new Set(
    'qwertyuiopasdfghjklzxcvbnm'.split('')
);

let won = false;
let currentWord = 'hello';

const GREY = 1;
const GREEN = 2;
const YELLOW = 3;

let guesses = [''];
let colors = [];

function init() {
    // Test stuff
    guesses = ['wrong', 'right', 'hello', 'bl'];
    colors = [
        [GREY, GREY, GREEN, YELLOW, GREY],
        [GREEN, GREEN, GREEN, YELLOW, GREEN],
        [GREEN, YELLOW, GREEN, YELLOW, GREY],
    ];

    document.addEventListener('keydown', (evt) => {
        if (evt.key == 'Backspace') {
            removeLetter();
        }
        else if (allLetters.has(evt.key)) {
            addLetter(evt.key);
        }
        else {
            return;
        }
        updateUI();
    });

    updateUI();
}

function reset() {
    guesses = [''];
    colors = [];
}

function addLetter(letter) {
    if (guesses[guesses.length - 1].length < 5) {
        guesses[guesses.length - 1] += letter;
    }
}

function removeLetter() {
    if (guesses[guesses.length - 1].length > 0) {
        guesses[guesses.length - 1] = guesses[guesses.length - 1].slice(0, guesses[guesses.length - 1].length - 1);
    }
}

function getColors(guess, actual) {
    let guessLetters = guess.split('');
    let actualLetters = actual.split('');
    let potentialYellows = actualLetters.slice();

    let colors = [GREY, GREY, GREY, GREY, GREY];
    // First do green, then yellow

    for (let i = 0; i < 5; i++) {
        if (guessLetters[i] == actualLetters[i]) {
            colors[i] = GREEN;
            potentialYellows.splice(
                potentialYellows.indexOf(guessLetters[i]),
                1);
        }
    }

    // yellows

    // for each letter in the guess, if it's green we're done. If it's yellow,
    // check if it's in the word (but also check if it's not a green);
    for (let i = 0; i < 5; i++) {
        if (colors[i] == GREEN) {
            continue;
        }

        if (potentialYellows.indexOf(guessLetters[i]) >= 0) {
            colors[i] = YELLOW;
            potentialYellows.splice(
                potentialYellows.indexOf(guessLetters[i]),
                1);
        }
    }
}

function updateUI() {
    const guessesElem = document.querySelector('.guesses');
    while (guessesElem.numChildren > guesses.length) {
        const guessElem = document.createElement('div');
        guessElem.classList.add('guess');
        guessesElem.appendChild(guessElem);
    }

    for (let i = 0; i < guesses.length; i++) {
        const guessElem = guessesElem.children[i];
        for (let j = 0; j < 5; j++) {
            const guessLetterElem = guessElem.children[j];
            const guess = guesses[i];
            const guessLetters = guess.split('');
            if (j < guess.length) {
                guessLetterElem.innerText = guessLetters[j].toUpperCase();
            }
            else {
                guessLetterElem.innerText = '';
            }


            if (i < colors.length) {
                const color = colors[i][j];
                guessLetterElem.classList.toggle('guess-letter-green', color == GREEN);
                guessLetterElem.classList.toggle('guess-letter-yellow', color == YELLOW);
                guessLetterElem.classList.toggle('guess-letter-grey', color == GREY);
            }
        }
    }
}

window.onload = init;
const query = document.querySelector("#query");
const search = document.querySelector("#search");
const resultContainer = document.querySelector(".result-container");
const audio = document.getElementById("audio");

const api = "https://api.dictionaryapi.dev/api/v2/entries/en/";

search.addEventListener("click", fetchDefinitions);
query.addEventListener("keydown", (e) => {
    if (e.key === "Enter") fetchDefinitions();
});

async function fetchDefinitions() {
    const word = query.value.toLowerCase();
    if (!word) return;

    const loader = displayLoader();

    let result;
    try {
        const response = await fetch(`${api}${word}`);
        if (response.status > 400) throw Error(response.status);

        const words = await response.json();

        result = getDefinitionCards(words);
    } catch (err) {
        result = getErrorMessage(err);
    } finally {
        resultContainer.innerHTML = result;
        query.value = "";
        loader.remove();
        addToSearchHistory(word);
    }
}

const getDefinitionCards = (words) =>
    words
        .map((wordObj) =>
            wordObj.meanings
                .map(
                    (meaning) =>
                        `<section class="card">
                        <section class="word-audio-container">
                            <section class="word-container">
                                <h4 class="word">${wordObj.word}</h4>
                                <p class="part-of-speech">${
                                    meaning.partOfSpeech
                                }</p>
                            </section>
                            ${wordObj.phonetics.reduce((result, phonetic) => {
                                if (phonetic.audio && phonetic.text && !result) {
                                    result = `<button class="play-audio" data-soundtrack="${phonetic.audio}" onclick="playAudio('${phonetic.audio}')"><i class="fa-solid fa-volume-high"></i></button>`;
                                }
                                return result;
                            }, "")}
                        </section>
   
                        <section class="phonetic-container">
                            ${wordObj.phonetics
                                .map((phonetic) =>
                                    phonetic.audio && phonetic.text
                                        ? `<button data-soundtrack="${phonetic.audio}" class="phonetic" onclick="playAudio('${phonetic.audio}')">${phonetic.text} <i class="fa-solid fa-volume-high"></i></button>`
                                        : ""
                                )
                                .join("")}
                        </section>
   
                        <section class="definition-container">
                            <ol>
                                ${meaning.definitions
                                    .map((definitionObj) =>
                                        definitionObj.example
                                            ? `<li>
                                        <p class="definition">${definitionObj.definition}</p>
                                        <p class="example">${definitionObj.example}</p>
                                    </li>`
                                            : `<li>
                                        <p class="definition">${definitionObj.definition}</p>
                                    </li>`
                                    )
                                    .join("\n")}
                            </ol>
                        </section>
                    </section>`
                )
                .join("\n")
        )
        .join("\n");

const displayLoader = () => {
    const loaderContainer = document.createElement("section");
    loaderContainer.classList.add("loader-container", "flex-column");
    loaderContainer.innerHTML = `
                <i class="fa-solid fa-spinner icon"></i>
                <p class="description">Loading...</p>
            `;
    document.body.appendChild(loaderContainer);
    return loaderContainer;
};

const getErrorMessage = (err) =>
    `<section class="error-container flex-column">
                <i class="fa-solid fa-face-frown icon"></i>
                ${
                    Number(err.toString().match(/\d{3}$/)) === 404
                        ? `<h4 class="reason">Sorry, I couldn't find it.</h4>
                    <p class="suggestion">Please check your spelling or try again later.</p>`
                        : `<h4 class="reason">${err}</h4>`
                }
            </section>`;

const playAudio = (url) => {
    audio.setAttribute("src", url);
    audio.play();
};

function addToSearchHistory(word) {
    const wordHistoryContainer = document.getElementById(
        "wordHistoryContainer"
    );
    const existingWordItems =
        wordHistoryContainer.querySelectorAll(".word-history-item");
    const existingWords = Array.from(existingWordItems).map(
        (item) => item.textContent
    );
    if (!existingWords.includes(word)) {
        const wordHistoryItem = document.createElement("div");
        wordHistoryItem.classList.add("word-history-item");
        wordHistoryItem.textContent = word;
        wordHistoryItem.addEventListener("click", () => {
            query.value = word;
            fetchDefinitions();
        });
        wordHistoryContainer.appendChild(wordHistoryItem);
    }
}

async function getWordOfTheDay() {
    const randomUrl = "https://random-word-api.herokuapp.com/word?number=1";
    const randomResponse = await fetch(randomUrl);
    const [randomWord] = await randomResponse.json();

    const wordOfTheDayUrl = `https://api.dictionaryapi.dev/api/v2/entries/en/${randomWord}`;
    const wordOfTheDayResponse = await fetch(wordOfTheDayUrl);
    const [wordOfTheDayData] = await wordOfTheDayResponse.json();

    const wordOfTheDayTitle = document.querySelector(
        ".word-of-the-day-title"
    );
    const wordOfTheDayPronunciation = document.querySelector(
        ".word-of-the-day-pronunciation"
    );
    const wordOfTheDayPartOfSpeech = document.querySelector(
        ".word-of-the-day-part-of-speech"
    );
    const wordOfTheDayDefinition = document.querySelector(
        ".word-of-the-day-definition"
    );
    const wordOfTheDayExample = document.querySelector(
        ".word-of-the-day-example"
    );

    wordOfTheDayTitle.textContent = wordOfTheDayData.word;
    wordOfTheDayPronunciation.textContent =
        wordOfTheDayData.phonetics[0]?.text || "";
    wordOfTheDayPartOfSpeech.textContent =
        wordOfTheDayData.meanings[0].partOfSpeech;
    wordOfTheDayDefinition.textContent =
        wordOfTheDayData.meanings[0].definitions[0].definition;
    wordOfTheDayExample.textContent =
        wordOfTheDayData.meanings[0].definitions[0].example || "";
}

function showWordOfTheDay() {
    const wordOfTheDayContainer =
        document.querySelector(".word-of-the-day");
    if (!wordOfTheDayContainer.classList.contains("show")) {
        wordOfTheDayContainer.classList.add("show");
        getWordOfTheDay();
    }
}
window.onload = showWordOfTheDay(); 

const translator = document.querySelector('#translator');

        const translatorPath = "translator.html";
translator.addEventListener('click', () => {
    window.open(translatorPath, "");
});

const searchButton = document.querySelector("#search-button");
const searchInput = document.querySelector("#search-input");
const mainword = document.querySelector("#mainmainword")
const textphone = document.querySelector(".text")
const meaningcontainer = document.querySelector('.meaningcontainer')
const footerlink = document.querySelector(".footerlink")
const volume = document.querySelector(".playbtn i")
const darkModeToggle = document.querySelector("#dark-mode-toggle");

const API = `https://api.dictionaryapi.dev/api/v2/entries/en/`
// const API_URL = `https://api.dictionaryapi.dev/api/v2/entries/en/keyboard`

let audio;

const dictionary = async (url) => {
    try {
        const response = await fetch(url);
        const data = await response.json();
        mainword.innerHTML = data[0].word;
        textphone.innerHTML = data[0].phonetics[1].text;
        showDefine(data[0].meanings);
        footerlink.innerHTML = data[0].sourceUrls + " " + `<i class="fa-solid fa-arrow-up-right-from-square" style="font-size: 10px;"></i>`;
        footerlink.href = data[0].sourceUrls

        const nonEmptyAudio = data[0].phonetics.find(phonetic => phonetic.audio);

        if (nonEmptyAudio) {
            audio = new Audio(nonEmptyAudio.audio);
        } else {
            console.error("No valid audio source found.");
        }

    } catch (error) {
        console.error("Error:", error);
    }
}

// dictionary(API_URL)


const showDefine = (mean) => {
    meaningcontainer.innerHTML = "";

    mean.forEach(define => {
        const { partOfSpeech, definitions, synonyms, antonyms } = define;
        const meaningElement = document.createElement("div");
        meaningElement.classList.add("meaningcontainer");

        const definitionList = definitions.map(definition => {
            if (definition.definition) {
                return `<li>${definition.definition}</li>`;
            }
            return '';
        }).join('');

        meaningElement.innerHTML = `
        <div class="partOfSpeechcontainer">
            <p class="partOfSpeech" style="font-style: italic; font-weight: bold">${partOfSpeech}</p>
            <hr />
          </div>

          <div class="wordmeaning">
            <p class="meaningheader">Meaning</p>
            <ul id="definitions">
              ${definitionList}
              ${definitions[0].example ? `<p class="example">"${definitions[0].example}"</p>` : ""}
            </ul>
          </div>

          ${synonyms.length >= 1 ? `<div class="wordsynonyms">
            <p class="synonymsheader">Synonyms</p>
            <p class="synonyms">${synonyms}</p>
          </div>` : ""}

          ${antonyms.length >= 1 ? `<div class="wordsynonyms">
            <p class="synonymsheader">Antonyms</p>
            <p class="synonyms">${antonyms}</p>
          </div>` : ""}
        `
        meaningcontainer.appendChild(meaningElement)
    });
}

volume.addEventListener("click", () => {
    volume.style.color = "#2196f3";
    audio.play().catch((error) => {
        // Handle any errors that occur when trying to play the audio
        console.error("Error playing audio:", error);
    });
    setTimeout(() => {
        volume.style.color = 'var(--grey)';
    }, 2000);
});

function handleSearch() {
    const wordIn = searchInput.value.trim();
    if (wordIn !== "") {
        dictionary(API + wordIn);
    }
}
searchButton.addEventListener("click", handleSearch);

searchInput.addEventListener("keyup", (e) => {
    if (e.key === "Enter") {
        handleSearch();
    }
});

const body = document.body;

function toggleDarkMode() {
    body.classList.toggle("dark-mode");
    const isDarkMode = body.classList.contains("dark-mode");
    localStorage.setItem("darkMode", isDarkMode);
}

darkModeToggle.addEventListener("change", toggleDarkMode);

const storedDarkMode = localStorage.getItem("darkMode");
if (storedDarkMode === "true") {
    body.classList.add("dark-mode");
    darkModeToggle.checked = true;
}
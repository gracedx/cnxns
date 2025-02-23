function initializeGame(groups, finalMessageFunc) {
    const words = Object.values(groups).flat();
    shuffleArray(words); // Properly shuffle words
    const selectedWords = [];
    const grid = document.getElementById("game-grid");
    const foundGroupsDiv = document.getElementById("found-groups");
    const messageDiv = document.getElementById("message");
    let foundGroupCount = 0;
    let guessCount = 0;

    // Reset game state
    grid.innerHTML = "";
    foundGroupsDiv.innerHTML = "";
    messageDiv.textContent = "";

    // Create and insert guess counter
    const guessCounterElement = document.createElement("p");
    guessCounterElement.id = "guess-counter";
    guessCounterElement.textContent = `incorrect guesses: ${guessCount}`;
    messageDiv.insertAdjacentElement("afterend", guessCounterElement);

    // Create word buttons
    words.forEach(word => {
        const div = document.createElement("div");
        div.className = "word";
        div.textContent = word;
        div.addEventListener("click", () => toggleSelection(div, word));
        grid.appendChild(div);
    });

    function toggleSelection(element, word) {
        const index = selectedWords.indexOf(word);
        if (index > -1) {
            selectedWords.splice(index, 1);
            element.classList.remove("selected");
        } else if (selectedWords.length < 4) {
            selectedWords.push(word);
            element.classList.add("selected");
        }
    }

    document.querySelector(".submit-button").addEventListener("click", checkSelection);

    function checkSelection() {
        if (selectedWords.length !== 4) {
            messageDiv.textContent = "pls select exactly four (4) words";
            return;
        }

        const groupName = Object.keys(groups).find(key => 
            groups[key].every(word => selectedWords.includes(word)) &&
            selectedWords.every(word => groups[key].includes(word))
        );

        if (groupName) {
            handleCorrectSelection(groupName);
        } else {
            handleIncorrectSelection();
        }

        resetSelection();
    }

    function handleCorrectSelection(groupName) {
        messageDiv.textContent = `yayy you found: ${groupName}.`;

        selectedWords.forEach(word => {
            const wordElement = [...grid.children].find(child => child.textContent === word);
            if (wordElement) wordElement.remove();
        });

        const groupList = document.createElement("div");
        groupList.innerHTML = `<h3>${groupName}</h3><p>${selectedWords.join(", ")}</p>`;
        foundGroupsDiv.appendChild(groupList);

        if (++foundGroupCount === Object.keys(groups).length) {
            messageDiv.innerHTML = finalMessageFunc(guessCount);
        }
    }

    function handleIncorrectSelection() {
        guessCount++;
        guessCounterElement.textContent = `incorrect guesses: ${guessCount}`;
        messageDiv.textContent = "try again";
    }

    function resetSelection() {
        selectedWords.length = 0;
        document.querySelectorAll(".word.selected").forEach(el => el.classList.remove("selected"));
    }
}

// Fisher-Yates shuffle algorithm
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

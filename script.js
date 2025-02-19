function initializeGame(groups, finalMessageFunc) {
    const words = Object.values(groups).flat();
    const shuffledWords = words.sort(() => Math.random() - 0.5);
    const selectedWords = [];
    const grid = document.getElementById("game-grid");
    const foundGroupsDiv = document.getElementById("found-groups");
    const messageDiv = document.getElementById("message");
    let foundGroupCount = 0; 
    let guessCount = 0; // Track incorrect guesses

    // Clear previous game state
    grid.innerHTML = "";
    foundGroupsDiv.innerHTML = "";
    messageDiv.textContent = ""; 

    // Create guess counter element
    const guessCounterElement = document.createElement("p");
    guessCounterElement.id = "guess-counter";
    guessCounterElement.textContent = `incorrect guesses: ${guessCount}`;
    messageDiv.insertAdjacentElement("afterend", guessCounterElement);

    // Create word buttons
    shuffledWords.forEach(word => {
        const div = document.createElement("div");
        div.className = "word";
        div.textContent = word;
        div.addEventListener("click", () => selectWord(div, word));
        grid.appendChild(div);
    });

    function selectWord(element, word) {
        if (selectedWords.includes(word)) {
            selectedWords.splice(selectedWords.indexOf(word), 1);
            element.classList.remove("selected");
        } else {
            if (selectedWords.length < 4) {
                selectedWords.push(word);
                element.classList.add("selected");
            }
        }
    }

    document.querySelector(".submit-button").addEventListener("click", () => {
        if (selectedWords.length !== 4) {
            messageDiv.textContent = "pls select exactly four (4) words";
            return;
        }

        // Check if selection is an exact match to a group
        const groupName = Object.keys(groups).find(key => {
            const groupWords = groups[key];
            return (
                groupWords.every(word => selectedWords.includes(word)) &&
                selectedWords.every(word => groupWords.includes(word))
            );
        });

        if (groupName) {
            messageDiv.textContent = `yayy you found: ${groupName}.`;

            // Remove selected words from the grid
            selectedWords.forEach(word => {
                const wordElement = [...grid.children].find(child => child.textContent === word);
                if (wordElement) {
                    wordElement.remove();
                }
            });

            // Append the found group to the "found-groups" div
            const groupList = document.createElement("div");
            groupList.innerHTML = `<h3>${groupName}</h3><p>${selectedWords.join(", ")}</p>`;
            foundGroupsDiv.appendChild(groupList);

            // Increment found groups count
            foundGroupCount++;

            // Check if all groups are found
            if (foundGroupCount === Object.keys(groups).length) {
                messageDiv.innerHTML = finalMessageFunc(guessCount); // Call the custom message function
            }
        } else {
            guessCount++; // Only increment on incorrect guess
            guessCounterElement.textContent = `incorrect guesses: ${guessCount}`;
            messageDiv.textContent = "try again";
        }

        // Reset selection
        selectedWords.length = 0;
        document.querySelectorAll(".word.selected").forEach(el => el.classList.remove("selected"));
    });
}

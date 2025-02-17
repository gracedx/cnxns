function initializeGame(groups, finalMessageFunc) {
    const words = Object.values(groups).flat(); // Flatten the groups into one array
    const shuffledWords = words.sort(() => Math.random() - 0.5);
    const selectedWords = [];
    const grid = document.getElementById("game-grid");
    const foundGroupsDiv = document.getElementById("found-groups");
    const messageDiv = document.getElementById("message");
    let foundGroupCount = 0; // Track the number of found groups

    // Clear the grid and found groups section in case of re-initialization
    grid.innerHTML = "";
    foundGroupsDiv.innerHTML = "";
    messageDiv.textContent = ""; // Clear message

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
            messageDiv.textContent = "Please select exactly 4 words!";
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
            messageDiv.textContent = `Yay! You found: ${groupName}.`;

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
                messageDiv.innerHTML = finalMessageFunc(); // Call the custom message function
            }
        } else {
            messageDiv.textContent = "Try again.";
        }

        // Reset selection
        selectedWords.length = 0;
        document.querySelectorAll(".word.selected").forEach(el => el.classList.remove("selected"));
    });
}

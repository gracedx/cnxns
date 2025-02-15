// Example groups (customize these)
const groups = {
  "Fruits": ["Apple", "Banana", "Orange", "Grape"],
  "Colors": ["Red", "Blue", "Green", "Yellow"],
  "Animals": ["Dog", "Cat", "Elephant", "Lion"],
  "Tools": ["Hammer", "Screwdriver", "Wrench", "Saw"]
};

// Flatten the groups into a shuffled array
const words = Object.values(groups).flat();
const shuffledWords = words.sort(() => Math.random() - 0.5);

const selectedWords = [];
const correctGroups = new Set();

// Populate the grid
const grid = document.getElementById("game-grid");
shuffledWords.forEach((word) => {
  const div = document.createElement("div");
  div.className = "word";
  div.textContent = word;
  div.addEventListener("click", () => selectWord(div, word));
  grid.appendChild(div);
});

// Handle word selection
function selectWord(element, word) {
  if (selectedWords.includes(word)) {
      // Deselect if already selected
      selectedWords.splice(selectedWords.indexOf(word), 1);
      element.classList.remove("selected");
  } else {
      // Select if less than 4 words are selected
      if (selectedWords.length < 4) {
          selectedWords.push(word);
          element.classList.add("selected");
      }
  }
}

// Handle submission
document.getElementById("submit-button").addEventListener("click", () => {
  if (selectedWords.length !== 4) {
      document.getElementById("message").textContent = "Please select exactly 4 words!";
      return;
  }

  // Check if the selected words form a valid group
  const groupName = Object.keys(groups).find((key) => {
      return groups[key].every((word) => selectedWords.includes(word));
  });

  if (groupName) {
      correctGroups.add(groupName);
      document.getElementById("message").textContent = `Correct! You found the ${groupName} group.`;
      
      // Remove the matched words
      selectedWords.forEach((word) => {
          const wordElement = [...grid.children].find((child) => child.textContent === word);
          if (wordElement) {
              wordElement.remove();
          }
      });

      // Clear selected words
      selectedWords.length = 0;

      // Check if the game is complete
      if (correctGroups.size === Object.keys(groups).length) {
          document.getElementById("message").textContent = "Congratulations! You found all the groups!";
      }
  } else {
      document.getElementById("message").textContent = "Incorrect group! Try again.";
  }

  // Clear selections
  selectedWords.length = 0;
  [...grid.children].forEach((child) => child.classList.remove("selected"));
});

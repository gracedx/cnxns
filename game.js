document.addEventListener("DOMContentLoaded", () => {
  const grid = document.querySelector(".grid");

  // Generate random values, ensuring 4 match
  const values = Array(4).fill("🔵").concat(Array(12).fill("⚪"));
  values.sort(() => Math.random() - 0.5); // Shuffle values

  // Render boxes
  values.forEach((value, index) => {
    const box = document.createElement("div");
    box.className = "box";
    box.dataset.value = value;
    box.addEventListener("click", () => handleBoxClick(box));
    grid.appendChild(box);
  });

  let selectedBoxes = [];

  function handleBoxClick(box) {
    if (box.classList.contains("selected")) return; // Prevent duplicate clicks
    box.classList.add("selected");
    selectedBoxes.push(box);

    // Check if the user has selected 4 boxes
    if (selectedBoxes.length === 4) {
      const allMatch = selectedBoxes.every(b => b.dataset.value === selectedBoxes[0].dataset.value);
      if (allMatch) {
        alert("You win!");
      } else {
        alert("Try again!");
      }
      resetSelection();
    }
  }

  function resetSelection() {
    selectedBoxes.forEach(box => box.classList.remove("selected"));
    selectedBoxes = [];
  }
});

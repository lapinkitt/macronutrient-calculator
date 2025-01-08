document.addEventListener("DOMContentLoaded", () => {
    const addRowButton = document.getElementById("add-row");
    const dataRows = document.getElementById("data-rows");
    const historyList = document.getElementById("history-list");

    // Load history from local storage
    function loadHistory() {
        const history = JSON.parse(localStorage.getItem("macronutrientHistory")) || [];
        historyList.innerHTML = ""; // Clear current list
        history.forEach(item => {
            const historyItem = document.createElement("div");
            historyItem.classList.add("history-item");
            historyItem.textContent = `${item.food} - Protein: ${item.protein}g, Fat: ${item.fat}g, Carbs: ${item.carbs}g`;
            historyItem.addEventListener("click", () => {
                const newRow = createRow(item.food, item.protein, item.fat, item.carbs);
                dataRows.appendChild(newRow);
                calculateRow(newRow);
            });
            historyList.appendChild(historyItem);
        });
    }

    // Save current data to local storage
    function saveToHistory(food, protein, fat, carbs) {
        const history = JSON.parse(localStorage.getItem("macronutrientHistory")) || [];
        history.push({ food, protein, fat, carbs });
        localStorage.setItem("macronutrientHistory", JSON.stringify(history));
        loadHistory();
    }

    // Create a new row
    function createRow(food = "", protein = 0, fat = 0, carbs = 0) {
        const newRow = document.createElement("tr");
        newRow.innerHTML = `
            <td><input type="text" value="${food}" placeholder="Food Name"></td>
            <td><input type="number" class="protein" value="${protein}"></td>
            <td><input type="number" class="fat" value="${fat}"></td>
            <td><input type="number" class="carbs" value="${carbs}"></td>
            <td class="calories">0</td>
            <td class="pfc-ratio">0:0:0</td>
        `;
        attachListeners(newRow);
        return newRow;
    }

    function calculateRow(row) {
        const protein = parseFloat(row.querySelector(".protein").value) || 0;
        const fat = parseFloat(row.querySelector(".fat").value) || 0;
        const carbs = parseFloat(row.querySelector(".carbs").value) || 0;

        const calories = (protein * 4) + (fat * 9) + (carbs * 4);
        row.querySelector(".calories").textContent = calories;

        const totalCalories = calories || 1; // Avoid division by zero
        const proteinPercentage = (protein * 4 / totalCalories);
        const fatPercentage = (fat * 9 / totalCalories);
        const carbPercentage = (carbs * 4 / totalCalories);

        const scaleFactor = 100 / (proteinPercentage + fatPercentage + carbPercentage);
        const proteinRatio = Math.round(proteinPercentage * scaleFactor);
        const fatRatio = Math.round(fatPercentage * scaleFactor);
        const carbRatio = Math.round(carbPercentage * scaleFactor);

        row.querySelector(".pfc-ratio").textContent = `${proteinRatio}:${fatRatio}:${carbRatio}`;
    }

    function attachListeners(row) {
        row.querySelectorAll("input").forEach(input => {
            input.addEventListener("input", () => {
                calculateRow(row);
                saveRowData(row);
            });
        });
    }

    function saveRowData(row) {
        const food = row.querySelector("input[type='text']").value || "";
        const protein = parseFloat(row.querySelector(".protein").value) || 0;
        const fat = parseFloat(row.querySelector(".fat").value) || 0;
        const carbs = parseFloat(row.querySelector(".carbs").value) || 0;
        saveToHistory(food, protein, fat, carbs);
    }

    addRowButton.addEventListener("click", () => {
        const newRow = createRow();
        dataRows.appendChild(newRow);
    });

    // Load history on page load
    loadHistory();
});

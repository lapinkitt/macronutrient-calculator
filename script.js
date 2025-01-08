document.addEventListener("DOMContentLoaded", () => {
    const addRowButton = document.getElementById("add-row");
    const dataRows = document.getElementById("data-rows");
    const historySection = document.getElementById("history");

    // Load history from local storage
    function loadHistory() {
        const history = JSON.parse(localStorage.getItem("macronutrientHistory")) || [];
        history.forEach(item => {
            const newRow = createRow(item.food, item.protein, item.fat, item.carbs);
            dataRows.appendChild(newRow);
            calculateRow(newRow);
        });
    }

    // Save current data to local storage
    function saveToHistory() {
        const rows = document.querySelectorAll("#data-rows tr");
        const history = [];
        rows.forEach(row => {
            const food = row.querySelector("input[type='text']").value || "";
            const protein = parseFloat(row.querySelector(".protein").value) || 0;
            const fat = parseFloat(row.querySelector(".fat").value) || 0;
            const carbs = parseFloat(row.querySelector(".carbs").value) || 0;
            history.push({ food, protein, fat, carbs });
        });
        localStorage.setItem("macronutrientHistory", JSON.stringify(history));
    }

    // Clear history
    function clearHistory() {
        localStorage.removeItem("macronutrientHistory");
        while (dataRows.firstChild) {
            dataRows.removeChild(dataRows.firstChild);
        }
        updateTotals();
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

    function updateTotals() {
        const rows = document.querySelectorAll("#data-rows tr");
        let totalProtein = 0, totalFat = 0, totalCarbs = 0, totalCalories = 0;

        rows.forEach(row => {
            totalProtein += parseFloat(row.querySelector(".protein").value) || 0;
            totalFat += parseFloat(row.querySelector(".fat").value) || 0;
            totalCarbs += parseFloat(row.querySelector(".carbs").value) || 0;
            totalCalories += parseFloat(row.querySelector(".calories").textContent) || 0;
        });

        document.getElementById("total-protein").textContent = totalProtein;
        document.getElementById("total-fat").textContent = totalFat;
        document.getElementById("total-carbs").textContent = totalCarbs;
        document.getElementById("total-calories").textContent = totalCalories;

        const totalCaloriesOverall = totalCalories || 1; // Avoid division by zero
        const totalProteinPercentage = (totalProtein * 4 / totalCaloriesOverall);
        const totalFatPercentage = (totalFat * 9 / totalCaloriesOverall);
        const totalCarbPercentage = (totalCarbs * 4 / totalCaloriesOverall);

        const scaleFactor = 100 / (totalProteinPercentage + totalFatPercentage + totalCarbPercentage);
        const totalProteinRatio = Math.round(totalProteinPercentage * scaleFactor);
        const totalFatRatio = Math.round(totalFatPercentage * scaleFactor);
        const totalCarbRatio = Math.round(totalCarbPercentage * scaleFactor);

        document.getElementById("total-pfc").textContent = `${totalProteinRatio}:${totalFatRatio}:${totalCarbRatio}`;
    }

    function attachListeners(row) {
        row.querySelectorAll("input").forEach(input => {
            input.addEventListener("input", () => {
                calculateRow(row);
                updateTotals();
                saveToHistory();
            });
        });
    }

    addRowButton.addEventListener("click", () => {
        const newRow = createRow();
        dataRows.appendChild(newRow);
        saveToHistory();
    });

    document.getElementById("clear-history").addEventListener("click", clearHistory);

    // Load history on page load
    loadHistory();
    updateTotals();
});

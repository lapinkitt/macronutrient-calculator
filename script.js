document.addEventListener("DOMContentLoaded", () => {
    const addRowButton = document.getElementById("add-row");
    const dataRows = document.getElementById("data-rows");

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

        // Convert ratios to whole numbers
        const scaleFactor = 100 / (proteinPercentage + fatPercentage + carbPercentage);
        const proteinRatio = Math.round(proteinPercentage * scaleFactor);
        const fatRatio = Math.round(fatPercentage * scaleFactor);
        const carbRatio = Math.round(carbPercentage * scaleFactor);

        row.querySelector(".pfc-ratio").textContent = `${proteinRatio}:${fatRatio}:${carbRatio}`;
    }

    function calculateTotals() {
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

        // Convert totals to whole number ratios
        const scaleFactor = 100 / (totalProteinPercentage + totalFatPercentage + totalCarbPercentage);
        const totalProteinRatio = Math.round(totalProteinPercentage * scaleFactor);
        const totalFatRatio = Math.round(totalFatPercentage * scaleFactor);
        const totalCarbRatio = Math.round(totalCarbPercentage * scaleFactor);

        document.getElementById("total-pfc").textContent = `${totalProteinRatio}:${totalFatRatio}:${totalCarbRatio}`;
    }

    function addRow() {
        const newRow = document.createElement("tr");
        newRow.innerHTML = `
            <td><input type="text" placeholder="Food Name"></td>
            <td><input type="number" class="protein" value="0"></td>
            <td><input type="number" class="fat" value="0"></td>
            <td><input type="number" class="carbs" value="0"></td>
            <td class="calories">0</td>
            <td class="pfc-ratio">0:0:0</td>
        `;
        dataRows.appendChild(newRow);
        attachListeners(newRow);
    }

    function attachListeners(row) {
        row.querySelectorAll("input").forEach(input => {
            input.addEventListener("input", () => {
                calculateRow(row);
                calculateTotals();
            });
        });
    }

    // Attach listeners to existing rows
    document.querySelectorAll("#data-rows tr").forEach(attachListeners);

    // Add new row on button click
    addRowButton.addEventListener("click", addRow);
});

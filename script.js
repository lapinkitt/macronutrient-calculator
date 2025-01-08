document.addEventListener("DOMContentLoaded", () => {
    const addRowButton = document.getElementById("add-row");
    const dataRows = document.getElementById("data-rows");

    function calculateRow(row) {
        const protein = parseFloat(row.querySelector(".protein").value) || 0;
        const fat = parseFloat(row.querySelector(".fat").value) || 0;
        const carbs = parseFloat(row.querySelector(".carbs").value) || 0;

        const calories = (protein * 4) + (fat * 9) + (carbs * 4);
        row.querySelector(".calories").textContent = calories;

        const totalMacros = protein + fat + carbs;
        const pfcRatio = totalMacros
            ? `${(protein / totalMacros).toFixed(1)}:${(fat / totalMacros).toFixed(1)}:${(carbs / totalMacros).toFixed(1)}`
            : "0:0:0";
        row.querySelector(".pfc-ratio").textContent = pfcRatio;
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

        const totalMacros = totalProtein + totalFat + totalCarbs;
        const totalPfc = totalMacros
            ? `${(totalProtein / totalMacros).toFixed(1)}:${(totalFat / totalMacros).toFixed(1)}:${(totalCarbs / totalMacros).toFixed(1)}`
            : "0:0:0";
        document.getElementById("total-pfc").textContent = totalPfc;
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

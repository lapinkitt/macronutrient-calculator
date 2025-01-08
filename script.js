document.addEventListener("DOMContentLoaded", () => {
    const searchButton = document.getElementById("search-button");
    const searchResults = document.getElementById("search-results");

    const API_KEY = "t5DR6pfosAuanVoc8eQtWvREhp6lpf4q17PNKZHs"; // Replace with your actual API key

    searchButton.addEventListener("click", () => {
        const query = document.getElementById("food-search").value;
        if (query.trim() === "") {
            alert("Please enter a food name.");
            return;
        }

        // Call the USDA API
        fetch(`https://api.nal.usda.gov/fdc/v1/foods/search?query=${query}&api_key=${API_KEY}`)
            .then(response => response.json())
            .then(data => {
                displayResults(data.foods);
            })
            .catch(error => {
                console.error("Error fetching data:", error);
                alert("Failed to fetch data. Please try again.");
            });
    });

    function displayResults(foods) {
        searchResults.innerHTML = ""; // Clear previous results
        if (foods.length === 0) {
            searchResults.innerHTML = "<p>No results found.</p>";
            return;
        }

        foods.forEach(food => {
            const foodItem = document.createElement("div");
            foodItem.classList.add("search-result-item");
            foodItem.innerHTML = `
                <strong>${food.description}</strong><br>
                <p>Protein: ${food.foodNutrients.find(n => n.nutrientName === "Protein").value || 0} g</p>
                <p>Fat: ${food.foodNutrients.find(n => n.nutrientName === "Total lipid (fat)").value || 0} g</p>
                <p>Carbs: ${food.foodNutrients.find(n => n.nutrientName === "Carbohydrate, by difference").value || 0} g</p>
                <button class="add-to-table" data-food='${JSON.stringify(food)}'>Add to Table</button>
            `;
            searchResults.appendChild(foodItem);
        });

        attachAddToTableButtons();
    }

    function attachAddToTableButtons() {
        document.querySelectorAll(".add-to-table").forEach(button => {
            button.addEventListener("click", (event) => {
                const food = JSON.parse(event.target.getAttribute("data-food"));
                const protein = food.foodNutrients.find(n => n.nutrientName === "Protein")?.value || 0;
                const fat = food.foodNutrients.find(n => n.nutrientName === "Total lipid (fat)")?.value || 0;
                const carbs = food.foodNutrients.find(n => n.nutrientName === "Carbohydrate, by difference")?.value || 0;

                const newRow = createRow(food.description, protein, fat, carbs);
                document.getElementById("data-rows").appendChild(newRow);
                calculateRow(newRow);
            });
        });
    }

    function createRow(food = "", protein = 0, fat = 0, carbs = 0) {
        const newRow = document.createElement("tr");
        newRow.innerHTML = `
            <td><input type="text" value="${food}" readonly></td>
            <td><input type="number" class="protein" value="${protein}"></td>
            <td><input type="number" class="fat" value="${fat}"></td>
            <td><input type="number" class="carbs" value="${carbs}"></td>
            <td class="calories">0</td>
            <td class="pfc-ratio">0:0:0</td>
        `;
        attachListeners(newRow);
        return newRow;
    }

    function attachListeners(row) {
        row.querySelectorAll("input").forEach(input => {
            input.addEventListener("input", () => {
                calculateRow(row);
            });
        });
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
});

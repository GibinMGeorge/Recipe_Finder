// Function to search for recipes based on ingredients
function searchRecipes() {
    const ingredients = document.getElementById('search-input').value.trim();
    const recipeResults = document.querySelector('.columns.mx-4.is-centered');

    // Clear previous results
    recipeResults.innerHTML = '';

    // Validate ingredient input
    if (!ingredients) {
        alert('Please enter ingredients.');
        return;
    }

    // Make API call to retrieve recipes based on ingredients using Recipe API
    fetch(`https://api.spoonacular.com/recipes/findByIngredients?ingredients=${ingredients}&number=5&apiKey=de1acafedb0a4a1198f8090c07677726`)
    .then(response => response.json())
    .then(data => {
        if (!data || data.length === 0) {
            recipeResults.innerHTML = '<p>No recipes found.</p>';
            return;
        }

        // Display recipe results
        data.forEach(recipe => {
            const recipeCard = document.createElement('div');
            recipeCard.classList.add('card', 'column', 'is-4', 'mx-3', 'my-3', 'has-text-centered');

            const recipeTitle = document.createElement('h6');
            recipeTitle.classList.add('title', 'has-text-centered', 'pt-3');
            recipeTitle.textContent = recipe.title;

            const recipeImage = document.createElement('img');
            recipeImage.classList.add('card-image', 'mx-3');
            recipeImage.src = recipe.image;
            recipeImage.alt = recipe.title;

            const recipeContent = document.createElement('p');
            recipeContent.classList.add('content', 'is-size-3', 'has-text-centered');
            // recipeContent.textContent = 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Expedita, incidunt!';

            const seeMoreBtn = document.createElement('button');
            seeMoreBtn.classList.add('button', 'is-info', 'see-more-btn');
            seeMoreBtn.setAttribute('data-target', 'modal');
            seeMoreBtn.setAttribute('data-recipe-id', recipe.id);
            seeMoreBtn.textContent = 'See more';

            recipeCard.appendChild(recipeTitle);
            recipeCard.appendChild(recipeImage);
            recipeCard.appendChild(recipeContent);
            recipeCard.appendChild(seeMoreBtn);

            recipeResults.appendChild(recipeCard);

            // Event listener to get recipe instructions when "See more" button is clicked
            seeMoreBtn.addEventListener('click', () => {
                getRecipeDetails(recipe.id);
            });
        });
    })
    .catch(error => {
        console.error('Error fetching recipes:', error);
    });
}

// Function to get recipe instructions and nutritional information
function getRecipeDetails(recipeId) {
    const instructionResults = document.querySelector('.modal-content');

    // Make API call to retrieve recipe instructions using Recipe API
    fetch(`https://api.spoonacular.com/recipes/${recipeId}/analyzedInstructions?apiKey=de1acafedb0a4a1198f8090c07677726`)
    .then(response => response.json())
    .then(data => {
        // Display recipe instructions
        const instructionsHtml = `
            <h2>Recipe Instructions</h2>
            <ol>
                ${data[0].steps.map(step => `<li>${step.step}</li>`).join('')}
            </ol>
        `;

        // Make API call to retrieve nutritional information using Recipe API
        return fetch(`https://api.spoonacular.com/recipes/${recipeId}/nutritionWidget.json?apiKey=de1acafedb0a4a1198f8090c07677726`)
            .then(response => response.json())
            .then(nutritionData => {
                // Display nutritional information
                const nutritionHtml = `
                    <h2>Nutritional Information</h2>
                    <p>Calories: ${nutritionData.calories}</p>
                    <p>Protein: ${nutritionData.protein}</p>
                    <p>Fat: ${nutritionData.fat}</p>
                    <p>Carbohydrates: ${nutritionData.carbs}</p>
                `;
                // Combine recipe instructions and nutritional information
                instructionResults.innerHTML = instructionsHtml + nutritionHtml;
            });
    })
    .catch(error => {
        console.error('Error fetching recipe details:', error);
    });
}
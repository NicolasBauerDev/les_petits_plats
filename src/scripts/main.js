import search from "./search.js";
import Recipes from "./Recipes.js";
import Filter from "./Filter.js";

window.onload = () => {
    const mainSearch = document.getElementById("main-search");
    const form = document.getElementById("form-search");
    const searchResults = search("");
    displayRecipes(searchResults);
    form.addEventListener("submit", (e) => {
        e.preventDefault();
    });
    mainSearch.addEventListener("input", (e) => {
        const value = e.target.value;
        const results = search(value);
        displayRecipes(results);
        console.table(results);
    });

    // Filtres
    const filterIngredients = new Filter("ingredients", getFilter(searchResults));
    filterIngredients.createList();
    updateFilter(filterIngredients.type, filterIngredients.items);
};

// Filtres
function getFilter(keywords) {
    const result = [];
    for (let i = 0; i < keywords.length; i++) {
        result.push(keywords[i].ingredients);
    }
    return result;
}

function updateFilter(type, keywords) {
    const filterTypeContainer = document.querySelector(`#${type} .list-select`);
    switch (type) {
        case "ingredients":
            for (let i = 0; i < keywords.length; i++) {
                const option = document.createElement("div");
                option.className = `
                    item 
                    font-manrope 
                    flex 
                    justify-between 
                    items-center 
                    hover:bg-regular-yellow 
                    px-4 
                    py-[9px] 
                    last:rounded-b-[11px] 
                    cursor-pointer
                    capitalize
                `;
                option.textContent = keywords[i];
                filterTypeContainer.appendChild(option);
            }
            break;
    }
    const optionElements = filterTypeContainer.childNodes;
    optionElements.forEach((option) => {
        option.addEventListener("click", (e) => {
            option.classList.toggle("selected");
        });
    });
}

// Recettes
function displayRecipes(results) {
    const recipes_count = document.getElementById("recipes_count");
    const listRecipes = document.getElementById("list-recipes");
    listRecipes.innerHTML = "";
    for (let i = 0; i < results.length; i++) {
        listRecipes.appendChild(new Recipes(results[i]).createRecipeCard());
    }
    recipes_count.textContent = results.length > 1 ? `${results.length} recettes` : `${results.length} recette`;
}

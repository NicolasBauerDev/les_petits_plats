import search from "./search.js";
import Recipes from "./Recipes.js";

window.onload = () => {
    const mainSearch = document.getElementById("main-search");
    const form = document.getElementById("form-search");
    form.addEventListener("submit", (e) => {
        e.preventDefault();
    });
    mainSearch.addEventListener("input", (e) => {
        const value = e.target.value;
        const results = search(value);
        displayRecipes(results);
        
    });
};

function displayRecipes(results) {
    const recipes_count = document.getElementById("recipes_count");
    const listRecipes = document.getElementById("list-recipes");
    listRecipes.innerHTML = "";
    for (let i = 0; i < results.length; i++) {
        listRecipes.appendChild(new Recipes(results[i]).createRecipeCard());
    }
    recipes_count.textContent = results.length > 1 ? `${results.length} recettes` : `${results.length} recette`;
}
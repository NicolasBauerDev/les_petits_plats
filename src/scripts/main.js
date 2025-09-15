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
        displayRecipes(giveSearchArguments(e.target.value));
    });

    // Filtres
    const filterIngredients = new Filter("ingredients", getFilterIngredients(searchResults));
    filterIngredients.createList();
    updateFilter(filterIngredients.type, filterIngredients.items);
};

function giveSearchArguments(argument) {
    return search(argument);
}

// Filtres
function getFilterIngredients(keywords) {
    const result = [];
    for (let i = 0; i < keywords.length; i++) {
        result.push(keywords[i].ingredients);
    }
    return result;
}

/**
 *
 * @param {string} type
 * @param {Array<string>} keywords
 */
function updateFilter(type, keywords) {
    const filterTypeContainer = document.querySelector(`#${type} .list-select`);
    const inputForm = document.querySelector(`input[name="${type}"]`);

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

    resetFilter(type);
    const nodeArray = [...filterTypeContainer.childNodes];
    inputForm.addEventListener("input", (e) => {
        const arrayFiltered = nodeArray.filter((element) =>
            element.textContent.toLowerCase().includes(e.target.value.toLowerCase()),
        );
        filterTypeContainer.innerHTML = "";
        arrayFiltered.forEach((element) => {
            filterTypeContainer.appendChild(element);
        });
    });

    // Fonctionnalité de recherche au clique
    const optionElements = filterTypeContainer.childNodes;
    optionElements.forEach((option) => {
        option.addEventListener("click", (e) => {
            option.classList.toggle("selected");
            if (option.classList.contains("selected")) {
                displayRecipes(giveSearchArguments(e.target.textContent));
                addTagElement(e.target.textContent);
            } else {
                removeTagElement(e.target.textContent);
                displayRecipes(giveSearchArguments(""));
            }
        });
    });
}

function resetFilter(type) {
    const inputForm = document.querySelector(`#${type} input[name="${type}"]`);
    const closeButton = document.querySelector(`#${type} .close-${type}`);
    closeButton.addEventListener("click", () => {
        inputForm.value = "";
    });
}

// Tags
/**
 * 
 * @param {string} tagName Nom du tag à épinglé
 */
function addTagElement(tagName) {
    const parentNode = document.querySelector("#list-tags");
    const divElement = document.createElement("div");
    divElement.classList.add("bg-regular-yellow", "flex", "justify-between", "px-5", "py-4", "lg:w-52", "rounded-xl");
    divElement.setAttribute("id", `tag-${tagName.split(" ").join("-")}`);
    divElement.innerHTML = `                
            <span class="font-manrope font-normal text-sm">${tagName}</span>
            <img class="cursor-pointer close-tag" src="assets/close_selection.svg" alt="Fermer"/>`;
    parentNode.appendChild(divElement);
    
}

/**
 * 
 * @param {string} id L'id du tag à supprimer
 */
function removeTagElement(id) {
    id = id.split(" ").join("-");
    const tagElement = document.querySelector(`#tag-${id}`);
   tagElement.remove();
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

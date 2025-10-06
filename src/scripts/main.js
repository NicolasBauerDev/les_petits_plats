import { search, searchByFilter } from "./search.js";
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
        displayRecipes(giveSearchArguments(e.target.value), e.target.value);
    });

    // Filtres
    openCloseFilter();
    initFilter(searchResults);
    displayRecipesByTag();
};

function giveSearchArguments(argument, filter = false) {
    if (argument.length >= 3 && !filter) {
        return search(argument);
    }
    if (filter) {
        return searchByFilter(argument);
    }
    return [];
}

// Filtres
function initFilter(data) {
    const filterIngredients = new Filter("ingredients", getFilter("ingredients", data));
    const filterUstensils = new Filter("ustensils", getFilter("ustensils", data));
    const filterAppliance = new Filter("appliance", getFilter("appliance", data));
    filterIngredients.createList();
    filterUstensils.createList();
    filterAppliance.createList();
    updateFilter(filterIngredients.type, filterIngredients.items);
    updateFilter(filterUstensils.type, filterUstensils.items);
    updateFilter(filterAppliance.type, filterAppliance.items);
}

/**
 *
 * @param {string} type Ingredients / Ustensils / Appliance
 * @param {Array} keywords Datas
 * @returns
 */
function getFilter(type, keywords) {
    const result = [];
    for (let i = 0; i < keywords.length; i++) {
        result.push(keywords[i][type]);
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

    // Création des éléments options pour les listes de filtres
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
    divElement.dataset.name = tagName;
    divElement.setAttribute("id", `tag-${tagName.split(/['()\s]+/).join("-")}`);
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
    id = id.split(/['()\s]+/).join("-");
    const tagElement = document.querySelector(`#tag-${id}`);
    tagElement.remove();
}

function setupTagCloseHandler(tagSelected) {
    const parentNode = document.querySelector("#list-tags");
    if (!parentNode) {
        return;
    }
    // Évite les doubles bindings si la fonction est rappelée par mégarde
    if (parentNode.dataset.bound === "1") {
        return;
    }
    parentNode.dataset.bound = "1";

    parentNode.addEventListener("click", (e) => {
        const closeBtn = e.target.closest(".close-tag");
        if (!closeBtn) {
            return;
        }

        const tagDiv = closeBtn.parentElement;
        const tagName =
            tagDiv && tagDiv.dataset && tagDiv.dataset.name
                ? tagDiv.dataset.name
                : tagDiv.querySelector("span")?.textContent || "";

        // 1) Retire le tag du tableau sélectionné
        const idx = tagSelected.indexOf(tagName);
        if (idx !== -1) {
            tagSelected.splice(idx, 1);
        }

        // 2) Retire la classe "selected" de l'option correspondante dans les listes
        const options = document.querySelectorAll(".filter .list-select .item");
        const target = tagName.trim().toLowerCase();
        options.forEach((opt) => {
            if (opt.textContent.trim().toLowerCase() === target) {
                opt.classList.remove("selected");
            }
        });

        // 3) Supprime visuellement le tag
        tagDiv.remove();

        // 4) Rafraîchit les recettes en fonction des tags restants
        if (tagSelected.length === 0) {
            displayRecipes(giveSearchArguments(""));
        } else {
            displayRecipes(giveSearchArguments(tagSelected, true));
        }
    });
}

function displayRecipesByTag() {
    const elementSelected = [];
    setupTagCloseHandler(elementSelected);
    const filtersElement = document.querySelectorAll(".filter .list-select");
    filtersElement.forEach((filter) => {
        const optionElements = filter.childNodes;
        optionElements.forEach((option) => {
            option.addEventListener("click", (e) => {
                option.classList.toggle("selected");
                if (option.classList.contains("selected")) {
                    elementSelected.push(e.target.textContent);
                    addTagElement(e.target.textContent);
                } else {
                    removeTagElement(e.target.textContent);
                    if (elementSelected.includes(e.target.textContent)) {
                        elementSelected.splice(elementSelected.indexOf(e.target.textContent), 1);
                    }
                }
                displayRecipes(giveSearchArguments(elementSelected, true));
            });
        });
    });
}

// Recettes
function displayRecipes(results, inputValue) {
    const recipes_count = document.getElementById("recipes_count");
    const listRecipes = document.getElementById("list-recipes");
    const noResult = document.getElementById("no-results");
    listRecipes.innerHTML = "";
    for (let i = 0; i < results.length; i++) {
        listRecipes.appendChild(new Recipes(results[i]).createRecipeCard());
    }
    recipes_count.textContent = results.length > 0 ? `${results.length} recettes` : `Aucune recette trouvée`;
    if (results.length <= 0 && inputValue && inputValue.length >= 3) {
        noResult.classList.remove("hidden");
        noResult.querySelector("h2").textContent = `Aucune recette ne contient ${inputValue}`;
    } else {
        noResult.classList.add("hidden");
    }
}

function openCloseFilter() {
    const filtersDropdown = document.querySelectorAll(".dropdown-panel");
    const arrowDropdown = document.querySelectorAll(".arrow-icon-dropdown");

    filtersDropdown.forEach((dropdown) => {
        dropdown.parentElement.addEventListener("click", () => {
            dropdown.classList.toggle("hidden");
        });
    });
    arrowDropdown.forEach(arrowIcon => {
        arrowIcon.parentElement.addEventListener("click", () => {
            arrowIcon.classList.toggle("rotate-180");
        });
    });
}
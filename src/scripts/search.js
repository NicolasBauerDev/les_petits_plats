import { recipes } from "../../data/recipes.js";

const RECIPESDATA = recipes;

/**
 *
 * @param {string} argument Argument de recherche saisi par l'utilisateur.
 * Recherche par Nom, description et ingrédients.
 * @param {Array} currentTab Tableau courant des résultats de recherche.
 * @returns {Array} Retourne un tableau d'objets recettes.
 */
export function search(argument) {
    const options = ["ingredients", "name", "description"];
    const results = [];
    if (typeof argument !== "string") {
        return new Error("L'argument doit être une chaîne de caractères.");
    }
    for (let i = 0; i < RECIPESDATA.length; i++) {
        const recipe = RECIPESDATA[i];
        for (let j = 0; j < options.length; j++) {
            const option = options[j];
            if (option === "ingredients") {
                const ingredients = recipe.ingredients;
                for (let k = 0; k < ingredients.length; k++) {
                    const ingredient = ingredients[k].ingredient;
                    if (
                        ingredient.toString().toLowerCase().includes(argument.toLowerCase()) &&
                        !results.includes(recipe)
                    ) {
                        results.push(recipe);
                    }
                }
                continue;
            }
            if (!recipe[option].toString().toLowerCase().includes(argument.toLowerCase())) {
                continue;
            }
            if (!results.includes(recipe)) {
                results.push(recipe);
            }
        }
    }

    return results;
}

/**
 * Recherche les recettes par Ustensils/Appareils/Ingredients
 * @param {string} type Ustensils/Appareils/Ingredients
 * @param {Array<string>} keywords Mots clé
 * @returns {Array}
 */
export function searchByType(type, keywords) {
    const result = [];
    switch (type) {
        case "ustensils":
            for (let i = 0; i < RECIPESDATA.length; i++) {
                const recipe = RECIPESDATA[i];
                const ustensilsArray = RECIPESDATA[i].ustensils;
                for (let j = 0; j < keywords.length; j++) {
                    if (ustensilsArray.includes(keywords[j])) {
                        if (!result.includes(recipe)) {
                            result.push(recipe);
                        }
                    }
                }
            }
            break;
        case "appliance":
            for (let i = 0; i < RECIPESDATA.length; i++) {
                const recipe = RECIPESDATA[i];
                const applianceRecipe = RECIPESDATA[i].appliance;
                for (let j = 0; j < keywords.length; j++) {
                    if (applianceRecipe.toLowerCase() === keywords[j].toLowerCase()) {
                        if (!result.includes(recipe)) {
                            result.push(recipe);
                        }
                    }
                }
            }
            break;
        case "ingredients":
            for (let i = 0; i < RECIPESDATA.length; i++) {
                const recipe = RECIPESDATA[i];
                const ingredientArray = RECIPESDATA[i].ingredients;
                for (let j = 0; j < ingredientArray.length; j++) {
                    for (let k = 0; k < keywords.length; k++) {
                        if (ingredientArray[j].ingredient.toLowerCase() === keywords[k].toLowerCase()) {
                            if (!result.includes(recipe)) {
                                result.push(recipe);
                            }
                        }
                    }
                }
            }
            break;
    }

    return result;
}

/**
 * Filtre les recettes en appliquant un ET logique sur tous les mots-clés.
 * Un mot-clé peut correspondre à un morceau de texte présent dans :
 *  - un nom d'ingrédient
 *  - un ustensile
 *  - l'appareil (appliance)
 *
 *
 * @param {string[]} keywords Tableau de mots-clés saisis (ex: ["lait de coco", "presse citron"]).
 * @param {Array} data Tableau de recettes (par défaut: RECIPESDATA).
 * @returns {Array} Recettes qui contiennent **tous** les mots-clés dans au moins une des 3 catégories.
 */
export function searchByFilter(keywords, data = RECIPESDATA) {
    if (!keywords || !Array.isArray(keywords) || keywords.length === 0) {
        return [];
    }

    const normalizedKeywords = [];
    for (let i = 0; i < keywords.length; i++) {
        const raw = keywords[i];
        if (typeof raw === "string") {
            const cleaned = raw.toLowerCase().trim();
            if (cleaned.length > 0) {
                normalizedKeywords.push(cleaned);
            }
        }
    }
    if (normalizedKeywords.length === 0) {
        return [];
    }

    const matchingRecipes = [];

    for (let r = 0; r < data.length; r++) {
        const recipe = data[r];

        const applianceLower = (recipe.appliance || "").toString().toLowerCase();

        const ingredientNamesLower = [];
        const ingredientsList = recipe.ingredients || [];
        for (let i = 0; i < ingredientsList.length; i++) {
            const ingName = (ingredientsList[i].ingredient || "").toString().toLowerCase();
            ingredientNamesLower.push(ingName);
        }

        const ustensilsLower = [];
        const ustensilsList = recipe.ustensils || [];
        for (let i = 0; i < ustensilsList.length; i++) {
            const ustName = (ustensilsList[i] || "").toString().toLowerCase();
            ustensilsLower.push(ustName);
        }
        

        let allKeywordsFound = true;

        for (let k = 0; k < normalizedKeywords.length; k++) {
            const kw = normalizedKeywords[k];
            let foundForThisKeyword = false;

            for (let i = 0; i < ingredientNamesLower.length; i++) {
                if (ingredientNamesLower[i].indexOf(kw) !== -1) {
                    foundForThisKeyword = true;
                    break;
                }
            }

            if (!foundForThisKeyword) {
                for (let i = 0; i < ustensilsLower.length; i++) {
                    if (ustensilsLower[i].indexOf(kw) !== -1) {
                        foundForThisKeyword = true;
                        break;
                    }
                }
            }

            if (!foundForThisKeyword) {
                if (applianceLower.indexOf(kw) !== -1) {
                    foundForThisKeyword = true;
                }
            }

            if (!foundForThisKeyword) {
                allKeywordsFound = false;
                break;
            }
        }

        if (allKeywordsFound) {
            matchingRecipes.push(recipe);
        }
    }

    return matchingRecipes;
}

/* export function searchByFilter(keywords, data) {
    const result = [];
    for (let i = 0; i < data.length; i++) {
        const recipe = data[i];
        const ustensilsArray = data[i].ustensils;
        const applianceRecipe = data[i].appliance;
        const ingredientArray = data[i].ingredients;
        for (let j = 0; j < keywords.length; j++) {
            if (ustensilsArray.includes(keywords[j].toLowerCase())) {
                if (!result.includes(recipe)) {
                    result.push(recipe);
                }
            }
            if (applianceRecipe.toLowerCase() === keywords[j].toLowerCase()) {
                if (!result.includes(recipe)) {
                    result.push(recipe);
                }
            }
        }
        for (let j = 0; j < ingredientArray.length; j++) {
            for (let k = 0; k < keywords.length; k++) {
                if (ingredientArray[j].ingredient.toLowerCase() === keywords[k].toLowerCase()) {
                    if (!result.includes(recipe)) {
                        result.push(recipe);
                    }
                }
            }
        }
    }
    console.log(result);
    
    return result;
} */
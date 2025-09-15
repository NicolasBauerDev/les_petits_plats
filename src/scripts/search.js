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

export function searchByFilter(keywords) {
    const result = [];
    for (let i = 0; i < RECIPESDATA.length; i++) {
        const recipe = RECIPESDATA[i];
        const ustensilsArray = RECIPESDATA[i].ustensils;
        const applianceRecipe = RECIPESDATA[i].appliance;
        const ingredientArray = RECIPESDATA[i].ingredients;
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
    return result;
}

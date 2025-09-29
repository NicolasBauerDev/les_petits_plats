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
    if (typeof argument !== "string") {
        throw new TypeError("L'argument doit être une chaîne de caractères.");
    }
    const normaliser = (s) =>
        String(s || "")
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .trim();

    argument = normaliser(argument);

    const results = RECIPESDATA.filter((recipe) => {
        const nomOK = normaliser(recipe.name).includes(argument);
        const descriptionOK = normaliser(recipe.description).includes(argument);

        const ingredientsOK =
            Array.isArray(recipe.ingredients) &&
            recipe.ingredients.some((ingredientIndex) => {
                const valeurIngredient = normaliser(ingredientIndex.ingredient).toLowerCase().trim();
                return valeurIngredient.includes(argument);
            });

        // Important: filter attend un booléen ✔️
        return nomOK || descriptionOK || ingredientsOK;
    });

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
    if (!Array.isArray(keywords) || keywords.length === 0) {
        return [];
    }

    const normaliser = (s) =>
        String(s || "")
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .trim();

    const normalizedKeywords = keywords
        .filter((kw) => typeof kw === "string")
        .map(normaliser)
        .filter(Boolean);

    if (normalizedKeywords.length === 0) {
        return [];
    }

    const results = data.filter((recipe) => {
        const applianceLower = normaliser(recipe.appliance);

        const ingredientNamesLower = (recipe.ingredients || [])
            .map((ing) => normaliser(ing.ingredient));

        const ustensilsLower = (recipe.ustensils || [])
            .map((u) => normaliser(u));

        // Chaque mot-clé doit être trouvé dans au moins une des 3 catégories
        const allKeywordsFound = normalizedKeywords.every((kw) =>
            ingredientNamesLower.some((name) => name.includes(kw)) ||
            ustensilsLower.some((ust) => ust.includes(kw)) ||
            applianceLower.includes(kw)
        );

        return allKeywordsFound;
    });

    return results;
}
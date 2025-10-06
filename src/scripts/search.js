import { recipes } from "../../data/recipes.js";

const RECIPESDATA = recipes;

/**
 *
 * @param {string} argument Argument de recherche saisi par l'utilisateur.
 * Recherche par Nom, description et ingrédients.
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
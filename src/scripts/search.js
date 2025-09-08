import { recipes } from "../../data/recipes.js";

const RECIPESDATA = recipes;

/**
 *
 * @param {string} argument Argument de recherche saisi par l'utilisateur.
 * Recherche par Nom, description et ingrédients.
 * @param {Array} currentTab Tableau courant des résultats de recherche.
 * @returns {Array} Retourne un tableau d'objets recettes.
 */
export default function search(argument) {
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

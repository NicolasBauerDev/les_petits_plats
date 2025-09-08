export default class Recipes {
    /**
     *
     * @param {Object} data Objet recette.
     */
    constructor(data) {
        this._id = data.id;
        this._image = data.image;
        this._name = data.name;
        this._servings = data.servings;
        this._ingredients = data.ingredients;
        this._time = data.time;
        this._description = data.description;
        this._appliance = data.appliance;
        this._ustensils = data.ustensils;
    }

    get id() {
        return this._id;
    }
    get ingredients() {
        return this._ingredients;
    }
    get name() {
        return this._name;
    }
    get description() {
        return this._description;
    }
    get image() {
        return this._image;
    }
    get time() {
        return this._time;
    }
    get appliance() {
        return this._appliance;
    }
    get ustensils() {
        return this._ustensils;
    }
    get servings() {
        return this._servings;
    }

    /**
     *
     * @returns {HTMLElement} Retourne une carte recette.
     */
    createRecipeCard() {
        const ingredientsList = [];
        for (let i = 0; i < this.ingredients.length; i++) {
            ingredientsList.push(`                            
                <div role="group" class="flex flex-1/2 flex-col">
                    <h4>${this.ingredients[i].ingredient}</h4>
                    <p class="font-manrope text-sm text-regular-gray">
                        ${this.ingredients[i].quantity ? this.ingredients[i].quantity : "Non indiqué"}
                        ${this.ingredients[i].unit ? this.ingredients[i].unit : ""}
                    </p>
                </div>`);
        }
        const article = document.createElement("article");
        article.classList.add("overflow-hidden", "rounded-[21px]", "lg:w-96");
        article.setAttribute("aria-label", `Recette de ${this.name}`);
        article.setAttribute("tabindex", "0");
        article.setAttribute("data-id", this.id);
        const header = document.createElement("header");
        header.classList.add("relative", "lg:h-64");
        const img = document.createElement("img");
        img.classList.add("object-cover", "lg:h-64");
        img.setAttribute("width", "100%");
        img.setAttribute("src", `../../assets/recipes/${this.image}`);
        img.setAttribute("alt", "Recette de " + this.name);
        img.setAttribute("loading", "lazy");
        const span = document.createElement("span");
        span.classList.add(
            "absolute",
            "top-5",
            "right-5",
            "rounded-[14px]",
            "bg-regular-yellow",
            "px-4",
            "py-1.5",
            "font-manrope",
            "text-xs"
        );
        span.textContent = `${this.time}min`;
        header.appendChild(img);
        header.appendChild(span);
        const div = document.createElement("div");
        div.setAttribute("role", "group");
        div.classList.add("flex", "flex-col", "gap-8", "bg-white", "p-8", "h-full", "lg:px-6");
        div.innerHTML = `
            ${this.name}
            <div role="group" class="flex flex-col">
                <h3>Recette</h3>
                <p>
                    ${this.description}
                </p>
            </div>
            <div role="group" class="flex flex-col">
                <h3>Ingrédients</h3>
                <div role="group" class="flex flex-wrap gap-y-5">
                    ${ingredientsList.join("")}
                </div>
            </div>`;
        article.appendChild(header);
        article.appendChild(div);
        return article;
    }
}

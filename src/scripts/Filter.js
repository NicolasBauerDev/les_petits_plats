export default class Filter {
    /**
     *
     * @param {string} type Type du filtre
     */
    constructor(type, data) {
        this._type = type;
        this._items = data;
    }
    /**
     * Retourne le nom du filtre
     * @returns {string}
     */
    get type() {
        return this._type;
    }
    /**
     * Retourne un tableau d'items
     * @returns {Array}
     */
    get items() {
        return this._items;
    }
    /**
     * @param {string} type Nom du filtre
     */
    set type(type) {
        this._type = type;
    }
    /**
     * @param {Array<Object>} items Tableau de recettes
     */
    set items(itemsArr) {
        this._items = itemsArr;
    }

    /**
     * Créer un ensemble d'éléments de la liste
     * @returns {Array} Retourne un tableau de string
     */
    createList() {
        const listItems = [];
        switch (this.type) {
            case "ingredients":
                for (let i = 0; i < this.items.length; i++) {
                    for (let j = 0; j < this.items[i].length; j++) {
                        // On évite les doublons
                        if (!listItems.includes(this.items[i][j].ingredient.toLowerCase())) {
                            listItems.push(this.items[i][j].ingredient.toLowerCase());
                        }
                    }
                }
                break;
            case "ustensils": 
                for (let i = 0; i < this.items.length; i++) {
                    for (let j = 0; j < this.items[i].length; j++) {
                        // On évite les doublons
                        if (!listItems.includes(this.items[i][j].toLowerCase())) {
                            listItems.push(this.items[i][j].toLowerCase());
                        }
                    }
                }
                break;
            case "appliance":
                for (let i = 0; i < this.items.length; i++) {
                    // On évite les doublons
                    if (!listItems.includes(this.items[i].toLowerCase())) {
                        listItems.push(this.items[i].toLowerCase());
                    }
                }
                break;
        }
        this.items = listItems;
    }

    /**
     * Rechercher un argument dans la liste
     * @param {string} input Nom de(s) argument(s) à chercher
     */
    searchArguments(input) {
        const currentList = [];
        if (this.items === Array.isArray() && this.items.length > 0) {
            for (let i = 0; i < this.items.length; i++) {
                currentList.push(this.items[i]);
            }
        } else {
            throw new Error("Aucune instance de l'objet filtre");
        }
        this.items = currentList.filter(argument => argument.toLowerCase().includes(input.toLocaleLowerCase()));
    }
}

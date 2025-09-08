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
     * @returns {Array} Retourne un tableau d'éléments HTML
     */
    createList() {
        const listItems = [];
        switch(this.type) {
            case "ingredients" :
                for (let i = 0; i < this.items.length; i++) {
                    for (let j = 0; j < this.items[i].length; j++) {
                        if(!listItems.includes(this.items[i][j].ingredient.toLowerCase())) {
                            listItems.push(this.items[i][j].ingredient.toLowerCase());
                        }
                    }
                }
        }
        this.items = listItems;
    }
}
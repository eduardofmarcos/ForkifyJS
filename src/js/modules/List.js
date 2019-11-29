import uniqid from 'uniqid';

/***** Class for Shopping List *****/

export default class List {
    constructor() {
        this.items = [];
    };

    /***** Methods for Shopping List *****/
    
    //add item to shopping-list
    addItem(count, unit, ingredient) {
        const item = {
            id: uniqid(),
            count,
            unit,
            ingredient
        };

        this.items.push(item);
        return item;
    };

    //delete item from shopping list
    deleteItem(id) {
        const index = this.items.findIndex(el => el.id === id);
        this.items.splice(index,1);
    };
        
    //update the shopping-list-count
    updateCount(id, newCount) {
        this.items.find(el =>el.id===id).count = newCount;
    };
};
var uniqid = require('uniqid');

export default class ShoppingList{
    constructor(){
        this.items = [];   
    }

    addItem(count,unit, ingredient){
        const item = {
            id: uniqid(),
            count, 
            unit,
            ingredient
        };
        this.items.push(item);
        return item;
    }

    deleteItem(id){
        //findIndex: Finds the first element in items array, with same id and returns the index
        //splice: remove 1 element at position returned by findIndex
        //splice method mutates the original array
        const index = this.items.findIndex(item => item.id === id);
        this.items.splice(index,1);
    }
    
    updateCount(id, newCount){
        this.items.find(item=> item.id === id).count = newCount;
    }
}
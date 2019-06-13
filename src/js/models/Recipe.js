import axios from 'axios';
import {Config} from '../config';
var Fraction = require('fractional').Fraction;

/**
{
  "recipe": {
    "publisher": "Jamie Oliver",
    "f2f_url": "http://food2fork.com/view/0063b5",
    "ingredients": [
            "2 tbsp olive oil , plus a little for greasing",
            "750g lean beef mince",
            "90g pack prosciutto",
            " quantity tomato sauce (see below)",
            "200ml hot beef stock",
            "a little grated nutmeg",
            "300g fresh pack lasagne sheets",
            " quantity white sauce (see below)",
            "125g ball mozzarella"
        ],
    "source_url": "http://www.jamieoliver.com/recipes/beef-recipes/simple-baked-lasagne",
    "recipe_id": "0063b5",
    "image_url": "http://static.food2fork.com/492_1_1350907030_lrga138.jpg",
    "social_rank": 99.99981883037542,
    "publisher_url": "http://www.jamieoliver.com",
    "title": "Simple baked lasagne"
  }
}
*/


export default class Recipe {
    constructor(id){
        this.id = id;
        
    }

    async getRecipe(){
        const URL = `${Config.BASE_URL}/get?key=${Config.API_KEY}&rId=${this.id}`; 
        try{
            const response = await axios.get(URL);
            const recipe = response.data.recipe;
            this.title = recipe.title;
            this.publisher = recipe.publisher;
            this.source_url = recipe.source_url;
            this.image_url = recipe.image_url;
            this.ingredients = recipe.ingredients;
            
        }catch(error){
            console.log(error);
        }
    }

    /**
     * There is no perfect way of calculating the time which is required to cook the recipe,
     * so it has been assumed that every ingredient takes 5 minutes.
     */
    calculateTime(){
        this.duration =  this.ingredients.length * 5;
    }

    calculateServings(){
        this.servings = 4;
    }

    /**
     * Idea: for each string of ingredients, parse and return an object {count, unit, ingredient}
     * Assumption: 
     * 1) Each ingredient may have a count or may not. If it has count, it has a unit. If it does not have a count, it will not have a unit. [Although this assumption is wrong and the code needs to be fixed for this, there are some ingredients where there is a unit but no count, eg. 'teaspoon of sugar']
     * 2) If an ingredient has a count, it will start from the 1st index of string and will last till the index the unit starts. (eg. 1 pound, 1 3/4 teaspoons)
     * 3) All the information inside parantheses in an ingredient can be removed.
     */
    parseIngredients(){
        const unitsLong = ['tablespoons','tablespoon','ounces','ounce','teaspoons','teaspoon','cups','pounds','slices'];
        const unitsShort = ['tbsp','tbsp','oz','oz','tsp', 'tsp','cup', 'pound','slice'];
        const newIngredients = this.ingredients.map(el=>{
            // Get Uniform units
            let ingredient = el.toLowerCase();
            unitsLong.forEach((currElement, currIndex)=>{
                ingredient = ingredient.replace(currElement, unitsShort[currIndex])
            })

            //remove paranthesis along with the words
            ingredient = ingredient.replace(/ *\([^)]*\) */g, " ");

            //parse ingredient into an object {count, unit, ingredient} itself
            const  arrIng = ingredient.split(' ');
            const unitIndex = arrIng.findIndex(el2 => unitsShort.includes(el2)); //finds the first index of element in an array which satisfies the condition : this element in array belongs to one of the unit short element.

            let objIng;
            if(unitIndex > -1){
                //There is a unit 
                //Ex 4 1/2 cups => [4,1/2]
                // 4 cups => [4]
                // 1-1/3 => [1-1/3]
                const arrCount = arrIng.slice(0,unitIndex); 
                let count;
                
               
                 if(arrCount.length==1){
                    //Edge case [1-1/3] => [1+1/3]
                    count = eval(arrIng[0].replace('-','+'));
                }
                else{
                    count = eval(arrIng.slice(0, unitIndex).join('+')) //[4,1/2] => '4+1/2' => 4.5
                }

                objIng ={
                    count,
                    unit: arrIng[unitIndex],
                    ingredient: arrIng.slice(unitIndex+1).join(' '),
                }


            }else if(parseInt(arrIng[0],10)){
                //There is no unit, but 1st element is a number
                objIng = {
                    //count:  new Fraction(parseInt(arrIng[0],10),1).toString(),
                    count: parseInt(arrIng[0],10),
                    unit: '',
                    ingredient: arrIng.slice(1).join(' '),
                }
            }
            else if(unitIndex == -1){
                //There is no number in 1st position, no unit.
                objIng = {
                    count: 1,
                    unit: '',
                    // ingredient: ingredient,  //IN ES6 if key and value are same, it can be replaced with the value only.
                    ingredient,
                }
            }

            return objIng;
        });
        this.ingredients = newIngredients;
    }

    updateServings(type){
        if(type =='dec' && this.servings <= 1)
            return;
        //servings
        const newServings =  type === 'dec' ? this.servings-1 : this.servings+1;
        //ingredients
        this.ingredients.forEach(ing => {
            ing.count *= (newServings /this.servings);
        })
        this.servings = newServings;

    }
}




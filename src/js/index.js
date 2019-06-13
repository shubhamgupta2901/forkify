import Search from './models/Search';
import Recipe from './models/Recipe';
import ShoppingList from './models/ShoppingList';
import Likes from './models/Likes';
import {elements, renderLoader, removeLoader} from './views/base';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import * as shoppingListView from './views/shoppingListView';
import * as likesView from './views/likesView';

//Main controller of the app from which controlls the app and delegates tasks to models and views
/**global state of the app
 * -Search Object
 * -Current recipe
 * -Shopping list
 * -liked recipe
 */
const state = {

}

/**
 * SEARCH CONTROLLER
 */
const controlSearch =  async() =>{
    const query = searchView.getInput();
    if(query){
        state.search = new Search(query);
        searchView.clearInput();
        searchView.clearResults();
        renderLoader(elements.resultList);
        await state.search.getResults();
        removeLoader();
        searchView.renderResults(state.search.result);
    }
}

const performSearch = async (event) => {
    event.preventDefault();
    controlSearch();
}

const changeSearchPage = (event) =>{
    const page = event.target.closest('.btn-inline').dataset.goto;
    searchView.clearResults();
    searchView.renderResults(state.search.result,page);
}

/**
 * RECIPE CONTROLLER
 */
const controlRecipe = async () => {
    const recipeId = window.location.hash.replace('#','');
    if(recipeId){
        state.recipe = new Recipe(recipeId);
        recipeView.clearRecipe();
        renderLoader(elements.recipeContainer);
        if(state.search)
            searchView.highlightSelected(recipeId);
        await state.recipe.getRecipe();
        state.recipe.calculateTime();
        state.recipe.calculateServings();
        state.recipe.parseIngredients();
        removeLoader();
        recipeView.renderRecipe(
            state.recipe,
            (state.likes ? state.likes.isLiked(state.recipe.id) : false)
        );
    }
}

const updateServings = (event) => {
    //If the event targets class is btn-decrease or one of its children
    if(event.target.matches('.btn-decrease, .btn-decrease *')){
        //Decrease button, or one of its is clicked
        state.recipe.updateServings('dec');
        recipeView.updateServingsIngredients(state.recipe);
    }
    else if(event.target.matches('.btn-increase, .btn-increase *')){
        //Increase button, or one of its is clicked
        state.recipe.updateServings('inc');
        recipeView.updateServingsIngredients(state.recipe);
    }
}


/**
 * SHOPPING LIST CONTROLLER
 */

const controlShoppingList = (event)=>{
    //If the event targets class is recipe__btn--add or one of its children
    if(event.target.matches('.recipe__btn--add, .recipe__btn--add *')){
        if(!state.shoppingList){
            state.shoppingList = new ShoppingList(); 
        }   
        state.recipe.ingredients.forEach(ing => {
            const item = state.shoppingList.addItem(ing.count,ing.unit, ing.ingredient);
            shoppingListView.renderItem(item);
        });
        shoppingListView.clearShoppingList();
        shoppingListView.renderShoppingList(state.shoppingList.items);
    }
    
} 

/**
 * LIKES CONTROLLER
 */

const restoreLikesFromLocalStorage = () => {
    state.likes = new Likes();
    state.likes.restoreData();
    likesView.toggleLikeMenu(state.likes.getNumLikes());
    state.likes.likes.forEach(like => likesView.addLike(like));
}

const controlLikes = () => {
    if(event.target.matches('.recipe__love, .recipe__love *')){
        const id = state.recipe.id;
        if(!state.likes){
            state.likes = new Likes();
        }
        
        if(!state.likes.isLiked(id)){
            const like = state.likes.addLike(id,state.recipe.title, state.recipe.publisher, state.recipe.image_url);
            likesView.toggleLikeButton(true);
            likesView.addLike(like);   
        }else{
            likesView.toggleLikeButton(false);
            state.likes.removeLike(id);
            likesView.deleteLike(id);
        }

        likesView.toggleLikeMenu(state.likes.getNumLikes());
    }
}

/**
 * APP CONTROLLER
 */
const init = () => {

    //reload likes from localstore if any
    window.addEventListener('load',()=> restoreLikesFromLocalStorage());
    
    elements.searchButton.addEventListener('click',event=>performSearch(event));
    elements.resultPages.addEventListener('click',event => changeSearchPage(event));
    ['hashchange','load'].forEach(event => window.addEventListener(event,controlRecipe));

    //Recipe button clicks
    elements.recipeContainer.addEventListener('click',event => updateServings(event));

    //Add to shopping List
    elements.recipeContainer.addEventListener('click', event => controlShoppingList(event));

    //Add to likes list
    elements.recipeContainer.addEventListener('click', event => controlLikes(event));

    //Delete and update from shopping list
    elements.shoppingList.addEventListener('click',(e)=>{
        const id = e.target.closest('.shopping__item').dataset.itemid;
        if(e.target.matches('.shopping__delete, .shopping__delete *')){
            state.shoppingList.deleteItem(id);
            shoppingListView.deleteItem(id);
        }
        else if(e.target.matches('.shopping__count-value')){
            const val = parseFloat(e.target.value);
            state.shoppingList.updateCount(id, val);
        }
    })

}


init();


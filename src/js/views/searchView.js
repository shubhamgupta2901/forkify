import {elements} from './base';

export const getInput = () => elements.searchInput.value;
export const clearInput = () => {
    elements.searchInput.value = '';
}; 


export const limitRecipeTitle = (title, limit = 17) => {
    if( title.length <= limit)
        return title;
    return `${title.substring(0,limit-1)}...`;
}


/**
    "publisher": "Jamie Oliver",
    "f2f_url": "http://food2fork.com/view/0063b5",
    "title": "Simple baked lasagne",
    "source_url": "http://www.jamieoliver.com/recipes/beef-recipes/simple-baked-lasagne",
    "recipe_id": "0063b5",
    "image_url": "http://static.food2fork.com/492_1_1350907030_lrga138.jpg",
    "social_rank": 99.99981883037542,
    "publisher_url": "http://www.jamieoliver.com"
*/

const renderRecipe = recipe =>{
    const recipeHTML = `
        <li>
            <a class="results__link" href="#${recipe.recipe_id}">
                <figure class="results__fig">
                    <img src="${recipe.image_url}" alt="${recipe.title}">
                </figure>
                <div class="results__data">
                    <h4 class="results__name">${limitRecipeTitle(recipe.title)}</h4>
                    <p class="results__author">${recipe.publisher}</p>
                </div>
            </a>
        </li>
        `;
    elements.resultList.insertAdjacentHTML('beforeend',recipeHTML);
};

export const highlightSelected = id => {
    const resultsArr = Array.from(document.querySelectorAll('.results__link'));
    resultsArr.forEach(el =>{
        el.classList.remove('results__link--active')
    });
    const el = document.querySelector(`.results__link[href*="${id}"]`);
    if(el){
        el.classList.add('results__link--active');
    }     
}

const createButton = (page, type) =>{

    const button = ` 
        <button class="btn-inline results__btn--${type}" data-goto=${page}>
            <span>Page ${page}</span>
            <svg class="search__icon">
                <use href="img/icons.svg#icon-triangle-${type === 'prev' ? 'left' : 'right'}"></use>
            </svg>   
        </button>
    `;
    elements.resultPages.insertAdjacentHTML('beforeend',button);

}
const renderButtons = (page, numOfTotalResults, resultPerPage) => {
    page = parseInt(page);
    const numOfPages = Math.ceil(numOfTotalResults / resultPerPage);
   
    if(page === 1 && numOfPages>1){
        //Button to go to next page
        createButton(page+1, 'next');
    }
    else if(page === numOfPages && numOfPages>1){
        
        //Button to go to prev page
        createButton(page-1, 'prev');
    }
    else if(page < numOfPages){
        //Both buttons for previous and next pages
        createButton(page-1, 'prev');
        createButton(page+1,'next');
    }
}


export const renderResults = (recipes, page = 1, resultPerPage = 10) =>{
    if(!recipes)
        return;

    const start = (page-1)*resultPerPage;
    const end = page*resultPerPage;
   
    for(let recipe of recipes.slice(start,end)){
        renderRecipe(recipe);
    }
    renderButtons(page,recipes.length, resultPerPage);
};

export const clearResults = () => {
    elements.resultList.innerHTML = '';
    elements.resultPages.innerHTML = '';
};
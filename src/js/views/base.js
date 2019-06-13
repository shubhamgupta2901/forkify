// file where all the html elements are binded with js objects and exported.
// also a file where we put all the styles and code that is reusable in the views.
export const elements  = {
    searchForm: document.querySelector('.search'),
    searchInput: document.querySelector('.search__field'),
    searchButton: document.querySelector('.search__btn'),
    resultList: document.querySelector('.results__list'),
    resultPages: document.querySelector('.results__pages'),
    recipeContainer: document.querySelector('.recipe'),
    shoppingList: document.querySelector('.shopping__list'),
    likesList: document.querySelector('.likes__list'),
    likesMenu: document.querySelector('.likes__field'),

} 
export const elementStrings = {
    loader: 'loader',
    
}

export const renderLoader = (parent) =>{
    const loader = `
        <div class="${elementStrings.loader}">
            <svg>
                <use href = "img/icons.svg#icon-cw"></use>
            </svg>
        </div>
    `;
    parent.insertAdjacentHTML('afterbegin',loader);
}

export const removeLoader = () => {
    const loader = document.querySelector(`.${elementStrings.loader}`);
    if(loader)
        loader.parentElement.removeChild(loader);

}

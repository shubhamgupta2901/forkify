import { elements } from "./base";
import { limitRecipeTitle } from "./searchView";


export const addLike = like => {
    const html = `
    <li>
        <a class="likes__link" href="#${like.id}">
            <figure class="likes__fig">
                <img src=${like.image_url} alt="${like.title}">
            </figure>
            <div class="likes__data">
                <h4 class="likes__name">${limitRecipeTitle(like.title,20)}</h4>
                <p class="likes__author">${like.publisher}</p>
            </div>
        </a>
    </li>
    `;
    elements.likesList.insertAdjacentHTML('afterbegin',html );
}

export const deleteLike = id => {
   const el = document.querySelector(`.likes__link[href*="${id}"]`).parentElement;
   if(el) el.parentElement.removeChild(el);
}

export const toggleLikeButton = isLiked => {
    const iconString = isLiked ? 'icon-heart' : 'icon-heart-outlined';
    document.querySelector('.recipe__love use').setAttribute('href',`img/icons.svg#${iconString}`);
}
  

export const toggleLikeMenu = numOfLikes =>{
    elements.likesMenu.style.visibility = numOfLikes > 0 ? 'visible' : 'hidden';
}
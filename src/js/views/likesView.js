import {elements} from './base';
import {limitRecipeTitle} from './searchView';

/***** Likes View *****/

//method to toggle the heart like/liked icon
export const toggleLIke = isLiked => {
const iconString = isLiked ? 'icon-heart' : 'icon-heart-outlined';
document.querySelector('.recipe__love use').setAttribute('href', `img/icons.svg#${iconString}`);
};

//method to hidden/visible the hear on top right of the page(UI), bases on numbe of likes
export const toogleLikesMenu = numLike => {
    elements.likesMenu.style.visibility = numLike > 0 ? 'visible' : 'hidden';
};

//method to render the likes list on UI
export const renderLike = like => {
    const markUp = `
        <li>
            <a class="likes__link" href="#${like.id}">
                <figure class="likes__fig">
                    <img src="${like.img}" alt="${like.title}">
                </figure>
                <div class="likes__data">
                    <h4 class="likes__name">${limitRecipeTitle(like.title)}</h4>
                    <p class="likes__author">${like.author}</p>
                </div>
            </a>
        </li>
    `;
    elements.likesList.insertAdjacentHTML('afterbegin', markUp);
};

//method to delete a liked item from the likes list, based on ID
export const removeLike = id => {
    const el = document.querySelector(`.likes__link[href*="${id}"]`);
    if(el) el.parentElement.removeChild(el);
};

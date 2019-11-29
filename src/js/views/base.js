//elements HTML classes
export const elements = {
    searchForm: document.querySelector('.search'),
    searchInput: document.querySelector('.search__field'),
    parentResult: document.querySelector('.results'),
    searchResList: document.querySelector('.results__list'),
    resultPages: document.querySelector('.results__pages'),
    recipe: document.querySelector('.recipe'),
    shoppingList: document.querySelector('.shopping__list'),
    likesMenu: document.querySelector('.likes__field'),
    likesList: document.querySelector('.likes__list')
};

//elementStrings -loader
export const elementStrings = {
    loader: 'loader',
};

//render loading icon
export const renderWait = parent => {
    
    const loader =  `
        <div class="${elementStrings.loader}">
            <svg>
                <use href = "img/icons.svg#icon-cw"></use>
            </svg>
        </div>
            `;
    parent.insertAdjacentHTML('afterbegin', loader);
};

//clear loading icon
export const clearLoader = () => {
    const loader = document.querySelector(`.${elementStrings.loader}`);
    if(loader) loader.parentElement.removeChild(loader);
};






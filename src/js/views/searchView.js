import { elements } from "./base";

/***** Search View *****/

//method to read a the input from UI
export const getInput = () => elements.searchInput.value;

//method to clear the input after a search
export const clearInput = () => {
  elements.searchInput.value = "";
};

//method to clear the resultlist and resultpages after the user make another search
export const clearResList = () => {
  elements.searchResList.innerHTML = "";
  elements.resultPages.innerHTML = "";
};

//method to highlight the choosen item. (CSS)
export const recipeHighlight = id => {
  const array = Array.from(document.querySelectorAll(".results__link"));
  array.forEach(el => {
    el.classList.remove("results__link--active");
  });
  document
    .querySelector(`.results__link[href*="${id}"]`)
    .classList.add("results__link--active");
};

/*
const limitRecipeTitle = (title, limit = 17) =>{
    if(title.length > limit){
        const newTitle = [];
        title.split(' ').reduce((acumulador, cur) =>{
            if(acumulador + cur.length < 17){
                newTitle.push(cur)
            }
            return acumulador + cur.length;
        },0)
        return `${newTitle.join(' ')}...`;
    }
    return title
}; 
*/

//method to limit the caracters of title on search List
export const limitRecipeTitle = (title, limit = 17) => {
  if (title.length > limit) {
    const newTitle = [];
    for (let i = 0; i < limit; i++) {
      newTitle.push(title[i]);
    }
    return `${newTitle.join("")}...`;
  }
  return title;
};

//method to create a recipe based on UI search
const renderRecipes = recipe => {
  const markUp = `
        <li>
            <a class="results__link " href=#${recipe.recipe_id}>
                <figure class="results__fig">
                    <img src=${recipe.image_url} alt=${recipe.title}>
                </figure>
                <div class="results__data">
                    <h4 class="results__name">${limitRecipeTitle(
                      recipe.title,
                      17
                    )}</h4>
                    <p class="results__author">${recipe.publisher}</p>
                </div>
            </a>
        </li>
        `;
  elements.searchResList.insertAdjacentHTML("beforeend", markUp);
};

//method to create the bunttons of pagination
const createButton = (page, type) => `
    
    <button class="btn-inline results__btn--${type}" data-goto=${
  type === "prev" ? page - 1 : page + 1
}>
        <span> Page ${type === "prev" ? page - 1 : page + 1}</span>
        <svg class="search__icon">
            <use href="img/icons.svg#icon-triangle-${
              type === "prev" ? "left" : "right"
            } "></use>
        </svg>
        
    </button>
    `;

//method to render the buttons of pagination on UI
const renderButton = (page, numresults, limitRec) => {
  let pages = Math.ceil(numresults / limitRec);

  let button;

  if (page === 1 && pages > 1) {
    button = createButton(page, "next");
  } else if (page < pages) {
    button = `
            ${createButton(page, "prev")}
            ${createButton(page, "next")}
        `;
  } else if (page === pages && pages > 1) {
    button = createButton(page, "prev");
  }

  elements.resultPages.insertAdjacentHTML("afterbegin", button);
};

//method to render the recipe and buttons results on UI calling the methods renderRecipes, renderButton
export const renderResults = (recipes, page = 2, limitRec = 10) => {
  const start = (page - 1) * limitRec;
  const end = page * limitRec;

  recipes.slice(start, end).forEach(renderRecipes);

  renderButton(page, recipes.length, limitRec);
};

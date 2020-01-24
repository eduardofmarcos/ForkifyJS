import Search from "./modules/Search";
import Recipe from "./modules/Recipe";
import List from "./modules/List";
import Likes from "./modules/Likes";
import * as searchView from "./views/searchView";
import * as recipeView from "./views/recipeView";
import * as listView from "./views/listView";
import * as likesView from "./views/likesView";
import { elements, renderWait, clearLoader } from "./views/base";

//******* GLOBAL STATE OF APP*******/
/*
//search object
//current recipe object
//shopping list object
//liked recipes
*/
const state = {};

//******* SEARCH CONTROLLER *******/

const controlSearch = async () => {
  //get the query from UI search field - (SearchView.js)
  const query = searchView.getInput();
  //if query is true, follow:
  if (query) {
    // create a new object based on query and add on state - (Search.js)
    state.search = new Search(query);
    //try:
    try {
      //clear the input after user click submit for search a item - (searchView)
      searchView.clearInput();
      //clear the result list after user click submit for search a item or a new item - (searchView)
      searchView.clearResList();
      //render the loading spin on UI search field
      renderWait(elements.parentResult);

      //await to get the recipes results from an API - AJAX - (Search.js)
      await state.search.getResults();
      //clear the spin loader after get the results - (searchView.js)
      clearLoader();
      //render the recipes results on UI - (Search.js)
      searchView.renderResults(state.search.result);
    } catch (error) {
      alert("Something goes wrong :(");
    }
  }
};

//method to prevent the page reaload default when click submit
elements.searchForm.addEventListener("submit", e => {
  e.preventDefault();
  controlSearch();
});

//pagination control
elements.parentResult.addEventListener("click", e => {
  const btn = e.target.closest(".btn-inline");
  if (btn) {
    searchView.clearResList();
    const goToPage = parseInt(btn.dataset.goto, 10);
    searchView.renderResults(state.search.result, goToPage);
  }
});

//******* RECIPE CONTROLLER *******/

const controlRecipe = async () => {
  //get the ID from UI based on location hash (data). Replace the hash for empty
  const id = window.location.hash.replace("#", "");
  //if id is true. Follow:
  if (id) {
    //if there is a recipe for other selection. Clear - (recipeView.js)
    recipeView.clearRecipes();
    //render the loading spin
    renderWait(elements.recipe);

    //if there is already a search on state, follow:
    if (state.search) {
      //highlight the item on search list based on ID - (searchView.js)
      searchView.recipeHighlight(id);
    }
    //create a new object Recipe and add on state - (Recipe.js)
    state.recipe = new Recipe(id);
    //try:
    try {
      //await get recipes from based on ID from a API - AJAX - (Recipe.js)
      await state.recipe.getRecipe();
      //get the recipe and parse the ingredients - (Recipe.js)
      state.recipe.parseIngredients();
      //get the recipe and calculate the time for servings - (Recipe.js)
      state.recipe.calcTime();
      //get the recipe and calculate the number os servings - (Recipe.js)
      state.recipe.calcServing();
      //clear the loader spin - (recipeView.js)
      clearLoader();
      //render the recipe on UI and check if is already liked - (recipeView.js)
      recipeView.renderRecipe(state.recipe, state.likes.isLiked(id));
    } catch (error) {
      alert("Something goes wrong");
    }
  }
};

//event handles for control recipes, based on hashchanges or load on window to call controlRecipe
["hashchange", "load"].forEach(event =>
  window.addEventListener(event, controlRecipe)
);

//******* SHOPPING LIST CONTROLLER *******/

const controlList = () => {
  //if there is NO state.list then create a new object list - (List.js)
  if (!state.list) state.list = new List();
  //getting the recipe from state.recipe and using the ingredients property - (List.js)
  state.recipe.ingredients.forEach(el => {
    //get the elements (id, count, unit, ingredient) from a ingredients array and and returning a object
    //base on ingredient
    const item = state.list.addItem(el.count, el.unit, el.ingredient); // - (List.js)
    //console.log(item)
    //render the ingredient especs on UI - (listView.js)
    listView.renderItem(item);
  });
};

//******* LIKES CONTROLLER *******/

const controlLike = () => {
  //if there is NO state.likes then create a new Object - (Likes.js)
  if (!state.likes) state.likes = new Likes();
  const currentId = state.recipe.id; //put the ID from state.recipe on a const
  //if false basead on ID then create a new like - (Like.js)
  if (!state.likes.isLiked(currentId)) {
    //call the funcion to create a new like based on ID
    const newLike = state.likes.addLike(
      currentId,
      state.recipe.title,
      state.recipe.author,
      state.recipe.img
    );
    //function to full the heart icon - (likesView.js)
    likesView.toggleLIke(true);
    //function to render the like list on UI - (likesView.js)
    likesView.renderLike(newLike);
  } else {
    //if there is already liked then when press the icon remove the item from state (List.js)
    state.likes.deleteItem(currentId);
    //toggle to the outline heart - (likesView.js)
    likesView.toggleLIke(false);
    //remove like item from like list - (likesView.js)
    likesView.removeLike(currentId);
  }
  //toogle the item heart of the top right of app based on number of likes - (likesView.js)
  likesView.toogleLikesMenu(state.likes.getNumLikes()); // (Likes.js)
};

/**** Handlings events ****/

//handling events when the page loads

window.addEventListener("load", () => {
  //create a new Object Likes - (Likes.js)
  state.likes = new Likes();
  //read the storagedata from browsers - (Likes.js)
  state.likes.readStorage();
  //toogle the item heart of the top right of app based on number of likes - (likesView.js)
  likesView.toogleLikesMenu(state.likes.getNumLikes());
  //call the function to render likes in case there is likes on browser storage, persistent data
  state.likes.likes.forEach(like => likesView.renderLike(like));
});

//handling events on List Shopping

elements.shoppingList.addEventListener("click", event => {
  const id = event.target.closest(".shopping__item").dataset.itemid;
  //delete a item from shopping list when click on delete button
  if (event.target.matches(".shopping__delete, .shopping__delete *")) {
    //delete the item from state
    state.list.deleteItem(id);
    //delete the item from UI
    listView.deleteItem(id);
  }
  //update the item when click + or -
  else if (event.target.matches(".shopping__count-value")) {
    //convert the value to float
    const val = parseFloat(event.target.value, 10);
    //update the value on state
    state.list.updateCount(id, val);
  }
});

//handling events on Recipes

window.addEventListener("click", e => {
  //decrease servings from UI and state
  if (e.target.matches(".btn-dec, btn-dec *")) {
    if (state.recipe.numServing > 1) {
      state.recipe.updateServings("dec");
      recipeView.updateSerINg(state.recipe);
    }
    //increase servings on UI
  } else if (e.target.matches(".btn-inc, btn-inc *")) {
    state.recipe.updateServings("inc");
    recipeView.updateSerINg(state.recipe);
    //if clicked on add on shopping list, call the function
  } else if (e.target.matches(".recipe-btn-add, recipe-btn-add *")) {
    controlList();
    //if cliked on heart call the function to like
  } else if (e.target.matches(".recipe__love, .recipe_love *")) {
    controlLike();
  }
});

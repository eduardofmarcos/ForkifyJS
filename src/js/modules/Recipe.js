import axios from "axios";

/***** Class for Recipes *****/

export default class Recipe {
  constructor(id) {
    this.id = id;
  }

  /***** Methods for Recipes *****/

  //trought axios make a AJAX call to get data recipe based on ID(passed from UI) from API
  async getRecipe() {
    try {
      const response = await axios(
        `https://forkify-api.herokuapp.com/api/get?rId=${this.id}`
      );
      this.title = response.data.recipe.title;
      this.author = response.data.recipe.publisher;
      this.img = response.data.recipe.image_url;
      this.url = response.data.recipe.source_url;
      this.ingredients = response.data.recipe.ingredients;
    } catch (error) {
      alert("Something goes wrong :(");
    }
  }
  //calculate time of recipe
  calcTime() {
    const num = this.ingredients.length;
    const period = Math.round(num / 3);
    this.time = period * 15;
  }
  //calculate number of servings of recipe
  calcServing() {
    this.numServing = 4;
  }
  //parse the items and make a standard of units and counts
  parseIngredients() {
    const unitLong = [
      "tablespoon",
      "tablespoons",
      "ounces",
      "ounce",
      "teaspoons",
      "teaspoon",
      "cups",
      "pounds"
    ];
    const unitShort = [
      "tbsp",
      "tbsp",
      "oz",
      "oz",
      "tsp",
      "tsp",
      "cup",
      "pound"
    ];

    const newIngredients = this.ingredients.map(items => {
      let ingredient = items.toLowerCase();
      unitLong.forEach((element, index) => {
        ingredient = ingredient.replace(element, unitShort[index]);
      });

      ingredient = ingredient.replace(/[{()}]/g, "");

      const arrIng = ingredient.split(" ");
      const unitIndex = arrIng.findIndex(element =>
        unitShort.includes(element)
      );

      let objIng;
      if (unitIndex > -1) {
        const arrayCount = arrIng.slice(0, unitIndex);

        let count;
        if (arrayCount.length === 1) {
          count = eval(arrayCount[0].replace("-", "+"));
        } else {
          count = eval(arrayCount.slice([0], unitIndex).join("+"));
        }

        objIng = {
          count,
          unit: arrIng[unitIndex],
          ingredient: arrIng.slice(unitIndex + 1).join(" ")
        };
      } else if (parseInt(arrIng[0], 10)) {
        objIng = {
          count: parseInt(arrIng[0], 10),
          unit: "",
          ingredient: arrIng.slice(1).join(" ")
        };
      } else if (unitIndex === -1) {
        objIng = {
          count: 1,
          unit: "",
          ingredient
        };
      }
      return objIng;
    });

    this.ingredients = newIngredients;
  }
  //update the servings
  updateServings(type) {
    const newServings =
      type === "dec" ? this.numServing - 1 : this.numServing + 1;

    this.ingredients.forEach(ing => {
      ing.count *= newServings / this.numServing;
    });

    this.numServing = newServings;
  }
}

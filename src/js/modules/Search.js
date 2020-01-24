import axios from "axios";

/***** Class Search *****/

export default class Search {
  constructor(query) {
    this.query = query;
  }

  /***** Methods for Search *****/

  //make a AJAX call using axios to get a query from API (query based on searchfield from UI)
  async getResults() {
    try {
      const response = await axios(
        `https://forkify-api.herokuapp.com/api/search?&q=${this.query}`
      );
      this.result = response.data.recipes;
    } catch (error) {
      alert(error);
    }
  }
}

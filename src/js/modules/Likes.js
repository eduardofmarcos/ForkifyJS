/***** Class for Likes List *****/

export default class Likes {
    constructor() {
        this.likes = [];
    };

/***** Methods for Likes List *****/

    //add item-like
    addLike(id, title, author, img ) {
        const like = {id, title, author, img};
        this.likes.push(like);
        this.persistData();
        return like;
    };

    //delete like
    deleteItem(id) {
    const index = this.likes.findIndex(el => el.id === id);
    this.likes.splice(index,1);
    this.persistData();
    };

    //check if is already liked
    isLiked(id) {
        return this.likes.findIndex(el => el.id === id) !== -1;
    };

    //get the number of like to give visibility or not to icon heart
    getNumLikes() {
        return this.likes.length;
    };

    //persist data to localstorage
    persistData() {
        localStorage.setItem('likes', JSON.stringify(this.likes));
    };
    
    //read data from localstorage
    readStorage() {
        const storage = JSON.parse(localStorage.getItem('likes'));
        if(storage) this.likes = storage;
    };
};
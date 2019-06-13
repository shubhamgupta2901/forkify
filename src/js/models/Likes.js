export default class Likes {
    constructor(){
        this.likes = [];
    }
    addLike(id, title,publisher, image_url){
        const like = {
            id,
            title, 
            publisher, 
            image_url
        }
        this.likes.push(like);
        this.persistData();
        return like;
    }

    removeLike(id){
        const index = this.likes.findIndex(like => like.id === id);
        this.likes.splice(index, 1);
        this.persistData();
    }

    isLiked(id){
        return this.likes.findIndex(like => like.id === id) !== -1;
    }

    getNumLikes(){
        return this.likes.length;
    }

    persistData(){
        localStorage.setItem('likes',JSON.stringify(this.likes));
    }

    restoreData(){
        if(localStorage.getItem('likes'))
            this.likes = JSON.parse(localStorage.getItem('likes'));
    }
}
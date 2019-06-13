import axios from 'axios';
import {Config} from '../config';

export default class Search {
    
    constructor(query){
        this.query = query;
    }

    async getResults() {
        const URL = `${Config.BASE_URL}/search?key=${Config.API_KEY}&q=${this.query}`; 
        try{
            const response = await axios.get(URL);
            this.result = response.data.recipes;
        }catch(error){
            console.log(error);
        }
    }
}
import axios from 'axios'

export const fetchCategories = async () => {
    try{
        var response = await axios.get("https://avet-shop-748665ae765c.herokuapp.com/api/categories");
        console.log(response.data.categories);
        return response.data.categories;
    }catch(e){
        console.error(e);
    }

    console.log(response);
}
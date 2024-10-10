import axios from 'axios'

export const fetchCategories = async () => {
    try{
        var response = await axios.get("http://localhost:5257/api/categories");
        console.log(response.data.categories);
        return response.data.categories;
    }catch(e){
        console.error(e);
    }

    console.log(response);
}
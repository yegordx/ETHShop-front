import axios from 'axios'

export const fetchCategories = async () => {
    try {
        const response = await axios.get("https://avet-shop-748665ae765c.herokuapp.com/api/categories");
        return response.data;
    } catch (e) {
        console.error(e);
        return [];
    }
};
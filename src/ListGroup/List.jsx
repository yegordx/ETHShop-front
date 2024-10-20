import { useEffect, useState, useContext } from 'react';
import ListGroupItem from 'react-bootstrap/ListGroupItem';
import { useNavigate } from 'react-router-dom';
import List from 'react-bootstrap/ListGroup';
import { AuthContext } from '../Contexts/AuthProvider'; // Імпорт контексту AuthProvider

export default function CategoryList() { // Зміна назви компонента
    const [categories, setCategories] = useState([]);
    const { apiRequest } = useContext(AuthContext); // Отримання apiRequest з AuthContext
    const navigate = useNavigate(); // Переміщено сюди, щоб використовувалося в компоненті

    useEffect(() => {
        const fetchData = async () => {
            try {
                const categories = await apiRequest('GET', 'api/categories');
                setCategories(categories);
            } catch (error) {
                console.error("Error fetching categories:", error);
            }
        };

        fetchData();
    }, [apiRequest]); // Додаємо apiRequest до залежностей useEffect

    const handleItemClick = (categoryId) => {
        // Перенаправляємо на сторінку з деталями категорії
        navigate(`/Category/${categoryId}`);
    };

    return (
        <List>
            {categories.map(category => (
                <ListGroupItem 
                    key={category.categoryID} 
                    onClick={() => handleItemClick(category.categoryID)}  // Обробник натискання
                    action
                >
                    <p>{category.categoryName}</p>
                </ListGroupItem>
            ))}
        </List>
    );
}

import { useEffect, useState, useContext } from 'react';
import ListGroupItem from 'react-bootstrap/ListGroupItem';
import List from 'react-bootstrap/ListGroup';
import { AuthContext } from '../Contexts/AuthProvider'; // Імпорт контексту AuthProvider

export default function ListGroup() {
    const [categories, setCategories] = useState([]);
    const { apiRequest } = useContext(AuthContext); // Отримання apiRequest з AuthContext

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

    return (
        <List>
            {categories.map(n => (
                <ListGroupItem key={n.categoryID}>
                    <p>{n.categoryName}</p>
                </ListGroupItem>
            ))}
        </List>
    );
}
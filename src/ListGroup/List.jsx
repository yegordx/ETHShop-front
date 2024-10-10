import List from 'react-bootstrap/ListGroup'; 
import ListGroupItem from 'react-bootstrap/ListGroupItem';
import { useEffect, useState } from 'react';
import { fetchCategories } from './fetchCategories';

export default function ListGroup() {
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            let categories = await fetchCategories();
            setCategories(categories);
        }
        fetchData();
    }, []);

    return (
        <List>
            {categories.map(n => (
                <ListGroupItem key={n.CategoryID}>
                    <p>{n.CategoryName}</p>
                </ListGroupItem>
            ))}
        </List>
    );
}
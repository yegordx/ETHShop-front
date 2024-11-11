import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../Contexts/AuthProvider';
import { Form, ListGroup } from 'react-bootstrap'; // Імпортуємо компоненти Bootstrap

export default function SearchElement() {
    const { apiRequest } = useContext(AuthContext);
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [results, setResults] = useState([]);

    useEffect(() => {
        // Затримка перед виконанням запиту (наприклад, 500 мс)
        const delayDebounce = setTimeout(() => {
            if (searchTerm) {
                makeRequest(searchTerm);
            } else {
                setResults([]); // Якщо немає тексту в полі пошуку, очищуємо результати
            }
        }, 500);

        // Очистка затримки при зміні введення
        return () => clearTimeout(delayDebounce);
    }, [searchTerm]);

    async function makeRequest(word) {
        try {
            const response = await apiRequest('GET', `api/search/${word}`);
            setResults(response || []); // Перевірка, щоб уникнути помилок
        } catch (error) {
            console.error('Error fetching search results:', error);
            setResults([]);
        }
    }

    // Обробка кліку по елементу списку
    function handleItemClick(type, id) {
        setSearchTerm('');  // Очистка значення поля пошуку
        navigate(`/${type}/${id}`);
    }

    return (
        <div>
            <Form.Control
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && results.length > 0 && (  // Перевірка на наявність введеного тексту та результатів
                <ListGroup className="mt-2">
                    {results.map((item) => (
                        <ListGroup.Item 
                            key={item.id} 
                            action
                            onClick={() => handleItemClick(item.type, item.id)}
                        >
                            {item.name} ({item.type})
                        </ListGroup.Item>
                    ))}
                </ListGroup>
            )}
        </div>
    );
}


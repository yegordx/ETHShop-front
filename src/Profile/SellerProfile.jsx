import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { AuthContext } from '../Contexts/AuthProvider';


export default function SellerProfile() {
    const { apiRequest } = useContext(AuthContext);
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();
    const userId = useParams();
    console.log(userId);

    useEffect(() => {
        const fetchSellerData = async () => {
            try {
                const userIdValue = userId.userId;
                // Відправляємо GET-запит на контролер з передачею ID в URL
                const response = await apiRequest('GET', `api/sellers/${userIdValue}`);
                
                // Виводимо отримані дані у консоль
                console.log(response);
            } catch (error) {
                console.error('Error:', error);
                setErrorMessage('An error occurred while fetching seller data.');
            }
        };
        
        fetchSellerData();
    }, [apiRequest, userId]);

    return (
        <>
            {errorMessage && <p>{errorMessage}</p>}
        </>
    );
}

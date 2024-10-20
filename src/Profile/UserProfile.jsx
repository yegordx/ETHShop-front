import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { AuthContext } from '../Contexts/AuthProvider';

export default function UserProfile(){
    const { apiRequest } = useContext(AuthContext);
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();
    const userId = useParams();
    console.log(userId);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const userIdValue = userId.userId;
                // Відправляємо GET-запит на контролер з передачею ID в URL
                const response = await apiRequest('GET', `api/users/${userIdValue}`);
                
                // Виводимо отримані дані у консоль
                console.log(response);
            } catch (error) {
                console.error('Error:', error);
                setErrorMessage('An error occurred while fetching seller data.');
            }
        };
        fetchUserData();
    }, [apiRequest, userId]);
    return(
        <>
        </>
    )
}
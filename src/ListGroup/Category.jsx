import React, { useContext, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../Contexts/AuthProvider';
import { Card, Button, Container, Row, Col, Modal, ListGroup } from 'react-bootstrap';
import WishlistModal from '../Modals/WishListModal';

export default function Category() {
    const { apiRequest, userId, isAuthenticated } = useContext(AuthContext);
    const [category, setCategory] = useState(null);
    const [wishlists, setWishlists] = useState([]); // Стан для збереження списків бажань
    const [selectedProductId, setSelectedProductId] = useState(null); // Стан для вибраного товару
    const [showWishlistModal, setShowWishlistModal] = useState(false); // Стан для модального вікна
    const [errorMessage, setErrorMessage] = useState('');
    const { categoryId } = useParams();
    const navigate = useNavigate();
    
    const handleViewDetails = (productId) => {
        navigate(`/Product/${productId}`);
    };
    
    // Функція для показу модального вікна та збереження вибраного продукту
    const handleAddToWishlist = (productId) => {
        setSelectedProductId(productId);
        setShowWishlistModal(true);
    };
    
    // Функція для додавання продукту до обраного списку бажань
    const handleSelectWishlist = async (wishlistId) => {
        try {
            await apiRequest('POST', `api/wishlists/${wishlistId}/${selectedProductId}`);
            alert('Product added to wishlist!');
        } catch (error) {
            console.error('Error adding product to wishlist:', error);
            alert('Failed to add product to wishlist.');
        }
        setShowWishlistModal(false); // Закриваємо модальне вікно після додавання
    };
    
    useEffect(() => {
        const fetchCategoryData = async () => {
            try {
                const response = await apiRequest('GET', `api/categories/${categoryId}`);
                setCategory(response);
                console.log(response);
            } catch (error) {
                console.error('Error fetching category data:', error);
                setErrorMessage('An error occurred while fetching category data.');
            }
        };
        
        const fetchWishListsData = async () => {
            try {
                if (isAuthenticated) {
                    const wishLists = await apiRequest('GET', `api/wishlists/${userId}`);
                    setWishlists(wishLists); // Зберігаємо списки бажань
                    console.log(wishLists);
                }
            } catch (error) {
                console.error('Error fetching wishlist data:', error);
                setErrorMessage('An error occurred while fetching wishlist data.');
            }
        };
        
        fetchCategoryData();
        fetchWishListsData();
    }, [apiRequest, categoryId, isAuthenticated, userId]);

    if (errorMessage) {
        return <p>{errorMessage}</p>;
    }

    if (!category) {
        return <p>Loading...</p>;
    }

    return (
        <Container style={{ minHeight: '100vh' }}>
            <h1>{category.categoryName}</h1>
            <p>{category.description}</p>
            <Row>
                {category.products && category.products.length > 0 ? (
                    category.products.map((product, index) => (
                        <Col key={index} md={4} className="mb-4">
                            <Card>
                                <Card.Body>
                                    <Card.Title>{product.productName}</Card.Title>
                                    <Card.Text>{product.description}</Card.Text>
                                    <Card.Text>Price (ETH): {product.priceETH}</Card.Text>
                                    <Button variant="primary" onClick={() => handleViewDetails(product.productID)}>
                                        Details
                                    </Button>{' '}
                                    <Button variant="secondary" onClick={() => handleAddToWishlist(product.productID)}>
                                        To wish list
                                    </Button>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))
                ) : (
                    <p>No products available.</p>
                )}
            </Row>
    
            {/* Модальне вікно для вибору списку бажань */}
            <WishlistModal
                show={showWishlistModal}
                onHide={() => setShowWishlistModal(false)}
                wishlists={wishlists}
                handleSelectWishlist={handleSelectWishlist}
            />
        </Container>
    );
}

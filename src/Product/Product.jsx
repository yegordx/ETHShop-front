import React, { useContext, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../Contexts/AuthProvider';
import { Container, Row, Col, Card, Button, Alert, Modal } from 'react-bootstrap';
import WishlistModal from '../Modals/WishListModal';
import ReviewCard from '../Review/ReviewCard';

export default function Product() {
    const { apiRequest, userId, isAuthenticated } = useContext(AuthContext);
    const [product, setProduct] = useState(null);
    const [wishlists, setWishlists] = useState([]);
    const [selectedProductId, setSelectedProductId] = useState(null); // Стан для вибраного товару
    const [showWishlistModal, setShowWishlistModal] = useState(false); // Стан для збереження даних товару
    const [errorMessage, setErrorMessage] = useState('');
    const { productId } = useParams(); // Отримання ID товару з URL

    const [reviews, setReviews] = useState([]);

    const handleAddToWishlist = (productId) => {
        setSelectedProductId(productId);
        setShowWishlistModal(true);
    };
    
    async function fetchReviewsData() {
        try {
            const response = await apiRequest('GET', `api/reviews`, {
                prodcutId: productId
            });
            setReviews(response);
        } catch (error) {
            console.error('Failed to fetch seller data:', error);
        }
    }

    async function handleAddToShoppingCart (productId) {
        try{
            console.log(userId);
            console.log(productId);
            const response = await apiRequest('POST', `api/shoppingcarts/${userId}/${productId}`);

        }catch(error){

        }
        
    };

    const handleSelectWishlist = async (wishListID) => {
        try {
            await apiRequest('POST', `api/wishlists/${wishListID}/${ selectedProductId }`);
            setShowWishlistModal(false); // Закриваємо модальне вікно після додавання
        } catch (error) {
            console.error('Error adding product to wishlist:', error);
        }
    };

    useEffect(() => {
        const fetchProductData = async () => {
            try {
                // Відправляємо GET-запит на контролер з передачею ID в URL
                const response = await apiRequest('GET', `api/products/${productId}`);
                setProduct(response); // Зберігаємо дані товару в стан
            } catch (error) {
                console.error('Error:', error);
                setErrorMessage('An error occurred while fetching product data.');
            }
        }

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
        
        fetchProductData();
        fetchWishListsData();
        fetchReviewsData();
    }, [apiRequest, productId, userId, isAuthenticated]);

    return (
    <Container style={{ minHeight: '100vh' }}>
        {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
        {product ? (
            <Row className="justify-content-center mt-4">
                <Col md={8}>
                    <Card>
                        <Card.Img variant="top" src={product.imageUrl} alt={product.productName} />
                        <Card.Body>
                            <Card.Title>{product.productName}</Card.Title>
                            <Card.Text>{product.description}</Card.Text>
                            <Card.Text>
                                <strong>Price: </strong>
                                {product.priceETH} ETH
                            </Card.Text>
                            { isAuthenticated ? (
                                <>
                                <Button variant="primary" onClick={() => handleAddToShoppingCart(productId)}>Add to Cart</Button>{' '}
                                <Button variant="secondary" onClick={() => handleAddToWishlist(productId)}>
                                    Add to Wishlist
                                </Button>
                                </>
                            ) : null }
                            
                        </Card.Body>
                    </Card>
                </Col>
                <ReviewCard reviews={reviews} />
            </Row>
        ) : (
            <Row className="justify-content-center mt-4">
                <Col md={8}>
                    <Alert variant="info">Loading product details...</Alert>
                </Col>
            </Row>
        )}

        {/* Використання WishListModal */}
        <WishlistModal
            show={showWishlistModal}
            onHide={() => setShowWishlistModal(false)}
            wishlists={wishlists}
            handleSelectWishlist={handleSelectWishlist}
        />
    </Container>
);

}

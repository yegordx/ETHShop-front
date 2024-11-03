import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AuthContext } from '../Contexts/AuthProvider'; // Ваш контекст
import { Container, Row, Col, Card, ListGroup, Button } from 'react-bootstrap';

import CreateProductModal from '../Product/CreateProductModal';

export default function SellerProfile() {
    const { apiRequest, userId } = useContext(AuthContext);
    const [sellerData, setSellerData] = useState(null);
    const { sellerId } = useParams();
    const [showModal, setShowModal] = useState(false);
    
    async function fetchSellerData() {
        try {
            const response = await apiRequest('GET', `api/sellers/${sellerId}`);
            setSellerData(response);
            console.log(response);
        } catch (error) {
            console.error('Failed to fetch seller data:', error);
        }
    }

    const handleDeleteProduct = async (productId) => {
        console.log(productId);
        try {
            await apiRequest('DELETE', `api/products/${productId}`);
            fetchSellerData();
        } catch (error) {
            console.error('Failed to delete product:', error);
        }
    };

    useEffect(() => {
        if (sellerId) {
            fetchSellerData();
            console.log(userId);
            console.log(sellerId);
        }
    }, [userId]);

    // Відкрити і закрити модальне вікно
    const handleShowModal = () => setShowModal(true);
    const handleCloseModal = () => setShowModal(false);

    // Відправка запиту для створення нового продукту
    const handleCreateProduct = async (newProductData) => {
        try {
            await apiRequest('POST', 'api/products', {
                sellerID: sellerId,
                ...newProductData
            });
            fetchSellerData(); // Оновити список продуктів після створення
        } catch (error) {
            console.error('Failed to create product:', error);
        }
    };

    if (!sellerData) {
        return <p>Loading...</p>;
    }

    return (
        <Container className="mt-5" style={{ minHeight: '100vh' }}>
            <Row>
                <Col md={4}>
                    <Card>
                        <Card.Body>
                            <Card.Title>Store Information</Card.Title>
                            <ListGroup variant="flush">
                                <ListGroup.Item><strong>Store Name:</strong> {sellerData.storeName}</ListGroup.Item>
                                <ListGroup.Item><strong>Description:</strong> {sellerData.description}</ListGroup.Item>
                                <ListGroup.Item><strong>Email:</strong> {sellerData.email}</ListGroup.Item>
                                <ListGroup.Item><strong>Phone Number:</strong> {sellerData.phoneNumber}</ListGroup.Item>
                            </ListGroup>
                        </Card.Body>
                    </Card>
                </Col>

                <Col md={8}>
                    <Card className="mb-4">
                        <Card.Body>
                            <Card.Title>Products</Card.Title>
                            {userId === sellerId && (
                                <Button variant="primary" className="mb-3" onClick={handleShowModal}>
                                    Add New Product
                                </Button>
                            )}
                            {sellerData.products && sellerData.products.length > 0 ? (
                            <ListGroup variant="flush">
                                {sellerData.products.map(product => (
                                    <ListGroup.Item key={product.id}>
                                        <strong>Product Name:</strong> {product.productName} - 
                                        <strong> Description:</strong> {product.description} - 
                                        <strong> Price:</strong> {product.priceETH} ETH
                                        {userId === sellerId && (
                                            <Button 
                                                variant="danger" 
                                                onClick={() => handleDeleteProduct(product.id)} 
                                                style={{ float: 'right' }}
                                            >
                                                Delete
                                            </Button>
                                        )}
                                    </ListGroup.Item>
                                ))}
                            </ListGroup>
                        ) : (
                            <p>No products found.</p>
                        )}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* Виклик модального вікна */}
            <CreateProductModal 
                show={showModal} 
                handleClose={handleCloseModal} 
                handleCreateProduct={handleCreateProduct} 
            />
        </Container>
    );
}




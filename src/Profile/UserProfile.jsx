import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { AuthContext } from '../Contexts/AuthProvider';
import { Container, Row, Col, Card, Button, Tabs, Tab, Alert, Accordion } from 'react-bootstrap';
import { VscHeart } from 'react-icons/vsc';

export default function UserProfile(){
    const { apiRequest } = useContext(AuthContext);
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();
    const userId  = useParams();
    const [user, setUser] = useState(null);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const userIdValue = userId.userId;

                // Відправляємо GET-запит на контролер з передачею ID в URL
                const response = await apiRequest('GET', `api/users/${userIdValue}`);
                console.log(response);
                setUser(response);
                // Виводимо отримані дані у консоль

            } catch (error) {
                console.error('Error:', error);
                setErrorMessage('An error occurred while fetching seller data.');
            }
        };
        fetchUserData();
    }, [apiRequest, userId]);

    const handleSelect = (eventKey) => {
        if (eventKey === 'orders') {
            navigate('/orders');
        } else if (eventKey === 'wishlists') {
            navigate('/wishlists');
        }
    };

    return (
        <Container style={{ minHeight: '100vh' }}>
            {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
            
            {user ? (
                <>
                    <Row className="mt-4">
                        <Col md={4}>
                            <Card>
                                <Card.Header>
                                    <h3>{user.userName}</h3>
                                </Card.Header>
                                <Card.Body>
                                    <p><strong>Email:</strong> {user.email}</p>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>

                    <Row className="mt-4">
                        <Col>
                            <Tabs defaultActiveKey="orders" onSelect={handleSelect}>
                                <Tab eventKey="orders" title="Orders">
                                    <Card className="mt-3">
                                        <Card.Body>
                                            {user.orders.length > 0 ? (
                                                user.orders.map((order) => (
                                                    <p key={order.orderId}>Order ID: {order.orderId}</p>
                                                ))
                                            ) : (
                                                <p>No orders found.</p>
                                            )}
                                        </Card.Body>
                                    </Card>
                                </Tab>
                                <Tab eventKey="wishlists" title="Wishlists">
                                    <Card className="mt-3">
                                        <Card.Body>
                                            {user.wishLists.length > 0 ? (
                                                user.wishLists.map((wishlist) => (
                                                    <p key={wishlist.wishListID}>Wishlist: {wishlist.name}</p>
                                                ))
                                            ) : (
                                                <p>No wishlists found.</p>
                                            )}
                                        </Card.Body>
                                    </Card>
                                </Tab>
                            </Tabs>
                        </Col>
                    </Row>
                    <Row className="mt-4">
                        <Col>
                            <h4>Reviews</h4>
                            <Accordion>
                                {user.reviews.length > 0 ? (
                                    user.reviews.map((review, index) => (
                                        <Accordion.Item eventKey={index.toString()} key={index}>
                                            <Accordion.Header>Review {index + 1}</Accordion.Header>
                                            <Accordion.Body>
                                                <p><strong>Rating:</strong> {review.rating}</p>
                                                <p><strong>Comment:</strong> {review.comment}</p>
                                                <p><strong>Date:</strong> {new Date(review.date).toLocaleDateString()}</p>
                                            </Accordion.Body>
                                        </Accordion.Item>
                                    ))
                                ) : (
                                    <p>No reviews found.</p>
                                )}
                            </Accordion>
                        </Col>
                    </Row>
                </>
            ) : (
                <p>Loading user data...</p>
            )}

            
        </Container>
    );
}
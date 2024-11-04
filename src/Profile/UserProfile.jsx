import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AuthContext } from '../Contexts/AuthProvider';
import { Container, Row, Col, Card, ListGroup, Button } from 'react-bootstrap';
import OrderCard from '../Order/OrderCard';
import EditUser from './EditUser';
export default function UserProfile() {
    const { apiRequest, userId, logout } = useContext(AuthContext);
    const [userData, setUserData] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const navigate = useNavigate();
    const { userID } = useParams();

    async function fetchUserData() {
        try {
            const response = await apiRequest('GET', `api/users/${userID}`);
            setUserData(response);
            console.log(response);
        } catch (error) {
            console.error('Failed to fetch user data:', error);
        }
    }

    useEffect(() => {
        if (userID) {
            fetchUserData();
        }
    }, [userID]);

    if (!userData) {
        return <p>Loading...</p>;
    }

    const handleViewAllReviews = () => {
        navigate('/ReviewsPage'); // path to the page with all user reviews
    };

    const handleEditUser = () => {
        setIsEditing(true);
    };

    const handleDeleteUser = async () => {
        // Implement delete user functionality here
        try {
            await apiRequest('DELETE', `api/users/${userID}`);
            logout();
            navigate('/'); // Redirect to the homepage or appropriate route after deletion
        } catch (error) {
            console.error('Failed to delete user:', error);
        }
    };

    return (
        <Container className="mt-5" style={{ minHeight: '100vh' }}>
            <Row>
                <Col md={4}>
                    <Card>
                        <Card.Body>
                            <Card.Title>Profile Information</Card.Title>
                            <ListGroup variant="flush">
                                <ListGroup.Item><strong>Username:</strong> {userData.userName}</ListGroup.Item>
                                <ListGroup.Item><strong>Email:</strong> {userData.email}</ListGroup.Item>
                            </ListGroup>
                            {userId === userID && (
                                <div className="mt-3">
                                    <Button variant="warning" onClick={handleEditUser}>Edit User</Button>
                                    <Button variant="danger" onClick={handleDeleteUser} className="ms-2">Delete User</Button>
                                </div>
                            )}
                        </Card.Body>
                    </Card>
                </Col>

                <Col md={8}>
                    <Card className="mb-4">
                        <Card.Body>
                            <Card.Title>Orders</Card.Title>
                            {userData.orders && userData.orders.length > 0 ? (
                                <ListGroup variant="flush">
                                    {userData.orders.map(order => (
                                        <OrderCard key={order.orderID} order={order} />
                                    ))}
                                </ListGroup>
                            ) : (
                                <p>No orders found.</p>
                            )}
                        </Card.Body>
                    </Card>

                    <Card className="mb-4">
                        <Card.Body>
                            <Card.Title>Reviews</Card.Title>
                            {userData.reviews && userData.reviews.length > 0 ? (
                                <Button variant="primary" onClick={handleViewAllReviews}>
                                    View All Reviews
                                </Button>
                            ) : (
                                <p>No reviews found.</p>
                            )}
                        </Card.Body>
                    </Card>

                    <Card className="mb-4">
                        <Card.Body>
                            <Card.Title>Shipping Addresses</Card.Title>
                            {userData.shippingAddresses && userData.shippingAddresses.length > 0 ? (
                                <ListGroup variant="flush">
                                    {userData.shippingAddresses.map((address, index) => (
                                        <ListGroup.Item key={index}>
                                            <strong>Address:</strong> {address.addressLine}, {address.city}, {address.country} - {address.postalCode}
                                        </ListGroup.Item>
                                    ))}
                                </ListGroup>
                            ) : (
                                <p>No shipping addresses found.</p>
                            )}
                        </Card.Body>
                    </Card>

                    <Card className="mb-4">
                        <Card.Body>
                            <Card.Title>Wish Lists</Card.Title>
                            {userData.wishLists ? (
                                <ListGroup variant="flush">
                                    {userData.wishLists.map((wishList, index) => (
                                        <ListGroup.Item key={index}>
                                            <strong>Wish List ID:</strong> {wishList.wishListID} - <strong>Items:</strong> {wishList.wishListItems.length}
                                        </ListGroup.Item>
                                    ))}
                                </ListGroup>
                            ) : (
                                <p>No wish lists found.</p>
                            )}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* Edit User Component */}
            {isEditing && (
                <EditUser userData={userData} onClose={() => setIsEditing(false)} />
            )}
        </Container>
    );
}

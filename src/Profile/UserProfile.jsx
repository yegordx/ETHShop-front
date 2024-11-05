import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AuthContext } from '../Contexts/AuthProvider';
import { Container, Row, Col, Card, ListGroup, Button, Modal } from 'react-bootstrap';
import OrderCard from '../Order/OrderCard';
import EditUser from './EditUser';
import EditShippingAddress from '../Address/EditAddress'

export default function UserProfile() {
    const { apiRequest, userId, logout } = useContext(AuthContext);
    const [userData, setUserData] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const navigate = useNavigate();
    const { userID } = useParams();
    const [showModal, setShowModal] = useState(false);
    const [selectedAddress, setSelectedAddress] = useState(null);

    const handleEditClick = (address) => {
        setSelectedAddress(address);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedAddress(null);
    };


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
    
    const handleDeleteAddress = async (id) => {
        // Implement delete user functionality here
        try {
            await apiRequest('DELETE', `api/addresses/${id}`);
        } catch (error) {
            console.error('Failed to delete address:', error);
        }
    };

    const handleViewWishListsDetails = (productId) => {
        navigate(`/WishLists`);
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
                                        <ListGroup.Item key={index} className="d-flex justify-content-between align-items-center">
                                            <div>
                                                <strong>Address:</strong> {address.addressLine}, {address.city}, {address.country} - {address.postalCode}
                                            </div>
                                            <div>
                                                <Button 
                                                    variant="outline-primary" 
                                                    size="sm" 
                                                    onClick={() => handleEditClick(address)}
                                                >
                                                    Edit
                                                </Button>
                                                <Button 
                                                    variant="outline-danger" 
                                                    size="sm" 
                                                    className="ms-2" 
                                                    onClick={() => handleDeleteAddress(address.addressId)} // Замість addressId вкажіть правильне поле
                                                >
                                                    Delete
                                                </Button>
                                            </div>
                                        </ListGroup.Item>
                                    ))}
                                </ListGroup>
                            ) : (
                                <p>No shipping addresses found.</p>
                            )}
                        </Card.Body>

                        {/* Modal for editing address */}
                        <Modal show={showModal} onHide={handleCloseModal}>
                            <EditShippingAddress address={selectedAddress} onClose={handleCloseModal} />
                        </Modal>
                    </Card>

                    <Card className="mb-4">
                        <Card.Body>
                            <Card.Title>Wish Lists</Card.Title>
                            {userData.wishLists && userData.wishLists.length > 0 ? (
                                userData.wishLists.map((wishList, index) => (
                                    <ListGroup.Item key={index}>
                                        <span 
                                            style={{ cursor: 'pointer', color: 'black', textDecoration: 'none' }} 
                                            onClick={() => handleViewWishListsDetails(wishList.id)}
                                        >
                                            <strong>{wishList.name}</strong>
                                        </span>
                                        <div>
                                            <strong>Items:</strong> {wishList.wishListItems.length}
                                        </div>
                                    </ListGroup.Item>
                                ))
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

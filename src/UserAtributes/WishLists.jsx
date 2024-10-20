import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../Contexts/AuthProvider';
import { Card, Button, ListGroup, Alert, Container, Row, Col, Form, Modal } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';


export default function WishLists() {
    const { apiRequest, userId } = useContext(AuthContext);
    const [wishlists, setWishlists] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');
    const [newWishlistName, setNewWishlistName] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false); // Модальне вікно для редагування списку // Назва нового списку
    const [editingWishlistId, setEditingWishlistId] = useState(null);

    const navigate = useNavigate();
    
    useEffect(() => {
        const fetchWishListsData = async () => {
            try {
                const response = await apiRequest('GET', `api/wishlists/${userId}`);
                setWishlists(response);
            } catch (error) {

            }
        };

        fetchWishListsData();
    }, [apiRequest, userId]);

    const handleNewWishlistSubmit = async (e) => {
        e.preventDefault();
        if (!newWishlistName) return;

        try {
            const response = await apiRequest('POST', 'api/wishlists', {
                UserId: userId,
                WishListName: newWishlistName, // Виправлено на правильну назву
            });

        } catch (error) {

        }
    };

    const handleDeleteWishList = async (wishListID) => {
        try {
            await apiRequest('DELETE', `api/wishlists/${wishListID}`);
            setWishlists(wishlists.filter(wishlist => wishlist.wishListID !== wishListID));
        } catch (error) {
            console.error('Error deleting wishlist:', error);
        }
    };

    // Функція для відкриття модального вікна для редагування
    const handleEditWishList = (wishListID, currentName) => {
        setEditingWishlistId(wishListID);
        setNewWishlistName(currentName);
        setShowEditModal(true);
    };

    // Функція для збереження редагованої назви списку побажань
    const handleSaveEditedWishlist = async (event) => {
        event.preventDefault();
        try {
            await apiRequest('PATCH', `api/wishlists/${editingWishlistId}`, newWishlistName, {
                'Content-Type': 'application/json'
            });
    
            // Оновлюємо стан списків бажань із новою назвою
            setWishlists(
                wishlists.map((wishlist) =>
                    wishlist.wishListID === editingWishlistId
                        ? { ...wishlist, name: newWishlistName }
                        : wishlist
                )
            );
            setShowEditModal(false); // Закриваємо модальне вікно після успішного збереження
        } catch (error) {
            console.error('Error updating wishlist:', error);
        }
    };

    return (
        <>
        <h1>WishLists</h1>
        <Container style={{ minHeight: '100vh' }}>
            <Row className="mt-4">
                {wishlists.length > 0 ? (
                    wishlists.map((wishlist) => (
                        <Col key={wishlist.wishListID} md={4} className="mb-3">
                            <Card>
                                <Card.Header>
                                    <h5>{wishlist.name}</h5>
                                </Card.Header>
                                <Card.Body>
                                    {wishlist.wishListItems.length > 0 ? (
                                        <ListGroup variant="flush">
                                            {wishlist.wishListItems.map((item) => (
                                                <ListGroup.Item key={item.wishListItemID}>
                                                    <strong>{item.productName}</strong>
                                                    <br />
                                                    Added : {new Date(item.dateAdded).toLocaleDateString()}
                                                    <br />
                                                    <Button
                                                        variant="primary"
                                                        onClick={() => navigate(`/product/${item.productID}`)}
                                                    >
                                                        View Product
                                                    </Button>
                                                </ListGroup.Item>
                                            ))}
                                        </ListGroup>
                                    ) : (
                                        <p>No items in this wishlist.</p>
                                    )}
                                </Card.Body>
                                <Card.Footer>
                                    <Button
                                        variant="danger"
                                        onClick={() => handleDeleteWishList(wishlist.wishListID)}
                                    >
                                        Delete
                                    </Button>
                                    <Button
                                        variant="warning"
                                        onClick={() => handleEditWishList(wishlist.wishListID, wishlist.name)}
                                    >
                                        Edit
                                    </Button>
                                </Card.Footer>
                            </Card>
                        </Col>
                    ))
                ) : (
                    <Col>
                        <Alert variant="info">No wishlists found.</Alert>
                    </Col>
                )}
            </Row>

            {/* Кнопка для відкриття модального вікна для створення нового списку бажань */}
            <Button variant="success" onClick={() => setShowModal(true)}>
                Create New Wishlist
            </Button>

            {/* Модальне вікно для введення назви нового списку бажань */}
            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Create New Wishlist</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleNewWishlistSubmit}>
                        <Form.Group controlId="wishlistName">
                            <Form.Label>Wishlist Name</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter wishlist name"
                                value={newWishlistName}
                                onChange={(e) => setNewWishlistName(e.target.value)}
                            />
                        </Form.Group>
                        <Button variant="primary" type="submit">
                            Submit
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>

            {/* Модальне вікно для редагування назви списку побажань */}
            <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Wishlist</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSaveEditedWishlist}>
                        <Form.Group controlId="editWishlistName">
                            <Form.Label>New Wishlist Name</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter new wishlist name"
                                value={newWishlistName}
                                onChange={(e) => setNewWishlistName(e.target.value)}
                            />
                        </Form.Group>
                        <Button variant="primary" type="submit">
                            Save Changes
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>
        </Container>
        </>
    );
    
}



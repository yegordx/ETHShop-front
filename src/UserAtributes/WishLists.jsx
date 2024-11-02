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
    const [showEditModal, setShowEditModal] = useState(false); // Модальне вікно для редагування списку
    const [editingWishlistId, setEditingWishlistId] = useState(null);
    const [wishListItems, setWishListItems] = useState({}); // Стан для кожного списку побажань

    const navigate = useNavigate();
    
    useEffect(() => {
        const fetchWishListsData = async () => {
            try {
                const response = await apiRequest('GET', `api/wishlists/${userId}`);
                setWishlists(response);
                // Ініціалізуємо стан для кожного списку побажань
                const initialWishListItems = response.reduce((acc, wishlist) => {
                    acc[wishlist.wishListID] = wishlist.wishListItems;
                    return acc;
                }, {});
                setWishListItems(initialWishListItems);
            } catch (error) {
                console.error('Error fetching wishlists:', error);
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
            setWishlists([...wishlists, response]); // Додаємо новий список до стану
        } catch (error) {
            console.error('Error creating wishlist:', error);
        }
    };

    const handleDeleteWishList = async (wishListID) => {
        try {
            await apiRequest('DELETE', `api/wishlists/${wishListID}`);
            setWishlists(wishlists.filter(wishlist => wishlist.wishListID !== wishListID));
            setWishListItems((prevItems) => {
                const updatedItems = { ...prevItems };
                delete updatedItems[wishListID];
                return updatedItems;
            });
        } catch (error) {
            console.error('Error deleting wishlist:', error);
        }
    };

    const handleEditWishList = (wishListID, currentName) => {
        setEditingWishlistId(wishListID);
        setNewWishlistName(currentName);
        setShowEditModal(true);
    };

    const handleRemoveWishListItem = async (wishListID, wishListItemID) => {
        try {
            await apiRequest('DELETE', `api/wishlists/remove/${wishListItemID}`);
            // Оновлюємо стан конкретного списку бажань
            setWishListItems((prevItems) => ({
                ...prevItems,
                [wishListID]: prevItems[wishListID].filter(item => item.wishListItemID !== wishListItemID)
            }));
        } catch (error) {
            console.error('Error removing wishlist item:', error);
        }
    };

    const handleSaveEditedWishlist = async (event) => {
        event.preventDefault();
        try {
            await apiRequest('PATCH', `api/wishlists/${editingWishlistId}`, newWishlistName, {
                'Content-Type': 'application/json'
            });
    
            setWishlists(
                wishlists.map((wishlist) =>
                    wishlist.wishListID === editingWishlistId
                        ? { ...wishlist, name: newWishlistName }
                        : wishlist
                )
            );
            setShowEditModal(false);
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
                                    {wishListItems[wishlist.wishListID]?.length > 0 ? (
                                        <ListGroup variant="flush">
                                            {wishListItems[wishlist.wishListID].map((item) => (
                                                <ListGroup.Item key={item.wishListItemID}>
                                                    <strong>{item.productName}</strong>
                                                    <br />
                                                    Added: {new Date(item.dateAdded).toLocaleDateString()}
                                                    <br />
                                                    <Button
                                                        variant="primary"
                                                        onClick={() => navigate(`/product/${item.productID}`)}
                                                    >
                                                        View Product
                                                    </Button>
                                                    <Button
                                                        variant="danger"
                                                        onClick={() => handleRemoveWishListItem(wishlist.wishListID, item.wishListItemID)}
                                                        className="ml-2"
                                                    >
                                                        ✖
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

            {/* Модальне вікно для створення нового списку бажань */}
            <Button variant="success" onClick={() => setShowModal(true)}>
                Create New Wishlist
            </Button>

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

            {/* Модальне вікно для редагування списку побажань */}
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



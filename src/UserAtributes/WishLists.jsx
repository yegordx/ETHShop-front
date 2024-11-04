import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../Contexts/AuthProvider';
import { Button, Card, Container, ListGroup, Modal, Form, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

export default function WishLists() {
    const { apiRequest, userId } = useContext(AuthContext);
    const [wishlists, setWishlists] = useState([]);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [newWishListName, setNewWishListName] = useState('');
    const [selectedWishList, setSelectedWishList] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchWishListsData();
    }, [userId]);

    async function fetchWishListsData() {
        try {
            const response = await apiRequest('GET', `api/wishlists/${userId}`);
            setWishlists(response);
        } catch (error) {
            console.error('Error fetching wishlists:', error);
        }
    }

    async function handleAddWishList() {
        await postWishList(newWishListName);
        setNewWishListName('');
        setShowAddModal(false);
        fetchWishListsData();
    }

    async function postWishList(wishListName) {
        await apiRequest('POST', `api/wishlists`, {
            UserId: userId,
            WishListName: wishListName
        });
    }

    async function handleEditWishList() {
        if (selectedWishList) {
            await patchWishListName(selectedWishList.wishListId, newWishListName);
            setSelectedWishList(null);
            setNewWishListName('');
            setShowEditModal(false);
            fetchWishListsData();
        }
    }

    async function patchWishListName(wishListId, wishListName) {
        await apiRequest('PATCH', `api/wishlists/${wishListId}`, {
            newWishListName: wishListName
        });
    }

    async function deleteWishList(wishListId) {
        await apiRequest('DELETE', `api/wishlists/${wishListId}`);
        fetchWishListsData();
    }

    async function removeItemFromWishList(itemId) {
        await apiRequest('DELETE', `api/wishlists/remove/${itemId}`);
        fetchWishListsData();
    }

    const handleViewDetails = (productId) => {
        navigate(`/Product/${productId}`);
    };

    return (
        <Container className="my-4" style={{ minHeight: '100vh' }}>
            <h2>Wish Lists</h2>
            <Button variant="primary" onClick={() => setShowAddModal(true)} className="mb-3">
                Add New Wishlist
            </Button>
            <Row>
                {wishlists.map((wishlist) => (
                    <Col md={6} lg={4} key={wishlist.wishListId} className="mb-4">
                        <Card>
                            <Card.Body>
                                <Card.Title>
                                    {wishlist.name}
                                    <Button
                                        variant="outline-secondary"
                                        size="sm"
                                        onClick={() => {
                                            setSelectedWishList(wishlist);
                                            setNewWishListName(wishlist.name);
                                            setShowEditModal(true);
                                        }}
                                        className="ms-2"
                                    >
                                        Edit
                                    </Button>
                                    <Button
                                        variant="outline-danger"
                                        size="sm"
                                        onClick={() => deleteWishList(wishlist.wishListId)}
                                        className="ms-2"
                                    >
                                        Delete
                                    </Button>
                                </Card.Title>
                                <ListGroup variant="flush">
                                    {wishlist.wishListItems.length > 0 ? (
                                        wishlist.wishListItems.map((item) => (
                                            <ListGroup.Item key={item.wishListItemID} className="d-flex align-items-center">
                                                <span
                                                    style={{ cursor: 'pointer', color: 'black', textDecoration: 'none' }}
                                                    onClick={() => handleViewDetails(item.productID)}
                                                >
                                                    {item.productName}
                                                </span>
                                                <Button
                                                    variant="outline-danger"
                                                    size="sm"
                                                    onClick={() => removeItemFromWishList(item.wishListItemID)}
                                                    className="ms-2"
                                                >
                                                    Remove
                                                </Button>
                                            </ListGroup.Item>
                                        ))
                                    ) : (
                                        <ListGroup.Item>No items in this wishlist.</ListGroup.Item>
                                    )}
                                </ListGroup>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>

            {/* Modal for adding a new wishlist */}
            <Modal show={showAddModal} onHide={() => setShowAddModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Add New Wishlist</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group>
                            <Form.Label>Wishlist Name</Form.Label>
                            <Form.Control
                                type="text"
                                value={newWishListName}
                                onChange={(e) => setNewWishListName(e.target.value)}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowAddModal(false)}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={handleAddWishList}>
                        Add Wishlist
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Modal for editing a wishlist name */}
            <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Wishlist Name</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group>
                            <Form.Label>Wishlist Name</Form.Label>
                            <Form.Control
                                type="text"
                                value={newWishListName}
                                onChange={(e) => setNewWishListName(e.target.value)}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowEditModal(false)}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={handleEditWishList}>
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
}



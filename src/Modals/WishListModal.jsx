// WishlistModal.js
import React from 'react';
import { Modal, ListGroup, Button } from 'react-bootstrap';

const WishlistModal = ({ show, onHide, wishlists, handleSelectWishlist }) => {
    return (
        <Modal show={show} onHide={onHide}>
            <Modal.Header closeButton>
                <Modal.Title>Select a Wishlist</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {wishlists.length > 0 ? (
                    <ListGroup>
                        {wishlists.map((wishlist) => (
                            <ListGroup.Item
                                key={wishlist.wishListID}
                                action
                                onClick={() => handleSelectWishlist(wishlist.wishListID)}
                            >
                                {wishlist.name}
                            </ListGroup.Item>
                        ))}
                    </ListGroup>
                ) : (
                    <p>No wishlists available.</p>
                )}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onHide}>
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default WishlistModal;

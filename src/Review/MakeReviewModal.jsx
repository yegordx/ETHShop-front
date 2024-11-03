// MakeReviewModal.js
import React, { useState, useContext } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { AuthContext } from '../Contexts/AuthProvider';

const MakeReviewModal = ({ show, handleClose, productId }) => {
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState("");
    const { userId, apiRequest } = useContext(AuthContext);

    const onSubmit = async () => {
        await handleReviewSubmit(); // Викликати запит для відправки відгука
        handleClose(); // Закрити модальне вікно
    };

    async function handleReviewSubmit() {
        try {
            await apiRequest('POST', `api/reviews`, {
                Rating: rating,
                Comment: comment,
                UserId: userId,
                ProductId: productId
            });
            console.log("Review submitted successfully");
        } catch (error) {
            console.error("Failed to submit review:", error);
        }
    };

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Make a Review</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group controlId="rating">
                        <Form.Label>Rating</Form.Label>
                        <div className="d-flex">
                            {[1, 2, 3, 4, 5].map(star => (
                                <span
                                    key={star}
                                    style={{ cursor: 'pointer', fontSize: '1.5em', color: star <= rating ? 'gold' : 'gray' }}
                                    onClick={() => setRating(star)}
                                >
                                    ★
                                </span>
                            ))}
                        </div>
                    </Form.Group>
                    <Form.Group controlId="comment" className="mt-3">
                        <Form.Label>Comment</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={3}
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder="Write your comment here"
                        />
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Cancel
                </Button>
                <Button variant="primary" onClick={onSubmit}>
                    Submit Review
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default MakeReviewModal;

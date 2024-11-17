// OrderCard.js
import React, { useState, useContext } from 'react';
import { Card, Accordion, Button, ListGroup } from 'react-bootstrap';
import MakeReviewModal from '../Review/MakeReviewModal';
import { AuthContext } from '../Contexts/AuthProvider';
import interactWithContract from './interactWihContract';

const OrderCard = ({ order }) => {
    const [showReviewModal, setShowReviewModal] = useState(false);
    const [selectedProductId, setSelectedProductId] = useState(null);
    const { userId, apiRequest } = useContext(AuthContext);

    const openReviewModal = (productId) => {
        setSelectedProductId(productId);
        setShowReviewModal(true);
    };

    async function ConfirmPayment(orderId){
        var thansHash = await apiRequest('GET', `api/orders/${orderId}/hash`);

        const confirmResult = await contract.methods
            .confirmPayment(transactionHash)
            .send({ from: account });
    }
    return (
        <Card className="mb-4">
            <Card.Body>
                <Accordion>
                    <Accordion.Item eventKey="0">
                        <Accordion.Header>
                            <div className="d-flex justify-content-between w-100">
                                <div>
                                    <strong>Order ID:</strong> {order.orderID}
                                </div>
                                <div>
                                    <strong>Order Date:</strong> {new Date(order.orderDate).toLocaleDateString()}
                                </div>
                            </div>
                        </Accordion.Header>
                        <Accordion.Body>
                            <div className="d-flex flex-column">
                                <h5>Order Items</h5>
                                {/* <Button variant='primary' onClick={ConfirmPayment(order.orderID)}>I confirm </Button> */}
                                <ListGroup variant="flush">
                                    {order.orderItems.length > 0 ? (
                                        order.orderItems.map(item => (
                                            <ListGroup.Item key={item.orderItemID} className="d-flex justify-content-between align-items-center">
                                                <div>
                                                    <strong>{item.productName}</strong> <br />
                                                    Quantity: {item.quantity}
                                                </div>
                                                <div className="d-flex align-items-center">
                                                    <span className="me-3">Total: {item.totalPrice} ETH</span>
                                                    <Button
                                                        variant="primary"
                                                        onClick={() => openReviewModal(item.productID)}
                                                    >
                                                        Make Review
                                                    </Button>
                                                </div>
                                            </ListGroup.Item>
                                        ))
                                    ) : (
                                        <p>No items found.</p>
                                    )}
                                </ListGroup>

                                <div className="mt-3">
                                    <h5>Total Price: {order.totalPrice} ETH</h5>
                                </div>

                                <h6 className="mt-4">Shipping Details</h6>
                                <p>{order.address.name} {order.address.surname}</p>
                                <p>{order.address.addressLine}, {order.address.city}, {order.address.country}</p>
                                <p>Postal Code: {order.address.postalCode}</p>
                            </div>
                        </Accordion.Body>
                    </Accordion.Item>
                </Accordion>
            </Card.Body>
            <MakeReviewModal
                show={showReviewModal}
                handleClose={() => setShowReviewModal(false)}
                productId={selectedProductId}
            />
        </Card>
    );
};

export default OrderCard;


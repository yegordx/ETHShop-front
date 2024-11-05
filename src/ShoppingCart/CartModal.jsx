import { useContext, useState } from 'react';
import { Modal, ListGroup, Button } from 'react-bootstrap';
import { AuthContext } from '../Contexts/AuthProvider';
import { useNavigate } from 'react-router-dom';

function CartModal({ items, show, onClose }) {
    const navigate = useNavigate();
    const { apiRequest } = useContext(AuthContext);

    const [quantities, setQuantities] = useState(
        items.reduce((acc, item) => ({ ...acc, [item.id]: item.quantity || 1 }), {})
    );

    async function increaseQuantity (id) {
        await apiRequest('PUT', `api/shoppingcarts/items/${id}`, {action: true});

    };

    async function decreaseQuantity(id) {
        await apiRequest('PUT', `api/shoppingcarts/items/${id}`, {action: false});
    };

    async function removeFromCart(id) {
        await apiRequest('DELETE', `api/shoppingcarts/items/${id}`);
    };

    // Групуємо товари за `sellerId`
    const itemsBySeller = items.reduce((acc, item) => {
        acc[item.sellerId] = acc[item.sellerId] || [];
        acc[item.sellerId].push(item);
        return acc;
    }, {});

    const totalAmount = items.reduce(
        (total, item) => total + item.priceETH * item.quantity,
        0
    );

    const handleOrder = (sellerId) => {
        onClose();
        navigate(`/MakeOrder/${sellerId}`);
    };

    return (
        <Modal show={show} onHide={onClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>Cart</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {items.length > 0 ? (
                    Object.keys(itemsBySeller).map((sellerId) => (
                        <div key={sellerId} className="mb-4">
                            <h5>Seller {sellerId}</h5>
                            <ListGroup>
                                {itemsBySeller[sellerId].map((item) => (
                                    <ListGroup.Item key={item.id} className="d-flex align-items-center position-relative">
                                        <div className="flex-grow-1">
                                            <h6>{item.productName}</h6>
                                            <p>Price: {item.priceETH} ETH</p>
                                            <div className="d-flex align-items-center">
                                                <Button
                                                    variant="outline-secondary"
                                                    size="sm"
                                                    onClick={() => decreaseQuantity(item.cartItemId)}
                                                >
                                                    -
                                                </Button>
                                                <span className="mx-2">{item.quantity}</span>
                                                <Button
                                                    variant="outline-secondary"
                                                    size="sm"
                                                    onClick={() => increaseQuantity(item.cartItemId)}
                                                >
                                                    +
                                                </Button>
                                            </div>
                                        </div>
                                        <div>
                                            <p>Sum: {(item.priceETH * item.quantity)} ETH</p>
                                        </div>
                                        <Button
                                            variant="dark"
                                            className="position-absolute top-0 end-0 p-1"
                                            onClick={() => removeFromCart(item.cartItemId)}
                                        >
                                            &times;
                                        </Button>
                                    </ListGroup.Item>
                                ))}
                            </ListGroup>
                            <div className="d-flex justify-content-between align-items-center mt-3">
                            <h5>Total: {totalAmount} ETH</h5>
                                <Button variant="success" onClick={() => handleOrder(sellerId)}>
                                    Make order
                                </Button>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>Cart is empty</p>
                )}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onClose}>
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

export default CartModal;


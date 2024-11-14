import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../Contexts/AuthProvider';
import { ListGroup, Form, Button, Container, Row, Col, Modal } from 'react-bootstrap';
import AddressManager from '../Address/AddressManager';
import interactWithContract from './interactWihContract';

function MakeOrder() {
    const { sellerId } = useParams();
    const navigate = useNavigate();
    const [items, setItems] = useState([]);
    const [selectedAddress, setSelectedAddress] = useState('');
    const { apiRequest, userId } = useContext(AuthContext);

    const totalAmount = items.reduce((total, item) => total + item.priceETH * item.quantity, 0);

    async function fetchItemsData() {
        try {
            const response = await apiRequest('GET', `api/shoppingcarts/${userId}/${sellerId}/items`);
            setItems(response);
        } catch (error) {
            console.error("Error fetching items:", error);
        }
    }

    useEffect(() => {
        if (userId) {
            fetchItemsData();
        }
    }, [userId, sellerId]);

    const handleMakeOrder = async () => {
        if (!selectedAddress) {
            alert("Please select a delivery address.");
            return;
        }
    
        try {
            // Створення замовлення через API
            const orderId = await apiRequest('POST', `api/orders`, {
                UserId: userId,
                SellerId: sellerId,
                AddressId: selectedAddress
            });
            alert("Order placed successfully!");
    
            const sellersWalletAddress = await apiRequest('GET', `api/sellers/wallet/${sellerId}`);
    
            const transHash = await interactWithContract(sellersWalletAddress, totalAmount);
    
            await apiRequest('POST', `api/orders/${orderId}`, {
                TransactionHash: transHash,
                Amount: totalAmount
            });
    
            // Перехід на сторінку профілю користувача
            navigate(`/UserProfile/${userId}`);
        } catch (error) {
            console.error("Error placing order:", error);
            alert("Error placing order. Please try again.");
        }
    };
    

    const handleRemove = async (productId) => {
        try {
            await apiRequest('DELETE', `api/shoppingcarts/items/${productId}`);
            setItems((prevItems) => prevItems.filter((item) => item.productId !== productId));
        } catch (error) {
            console.error("Error removing item:", error);
        }
    };

    return (
        <Container style={{ minHeight: '100vh' }}>
            <Button variant="link" onClick={() => navigate(-1)} className="mt-3">
                Back to Shopping
            </Button>
            <h2 className="mt-4">Checkout for Seller {sellerId}</h2>
            <ListGroup className="my-4">
                {items.map((item) => (
                    <ListGroup.Item key={item.id} className="d-flex align-items-center">
                        <div className="flex-grow-1">
                            <h6>{item.productName}</h6>
                            <p>Price: {item.priceETH} ETH</p>
                            <p>Quantity: {item.quantity}</p>
                        </div>
                        <div className="d-flex align-items-center">
                            <p>Sum: {(item.priceETH * item.quantity)} ETH</p>
                            <Button
                                variant="outline-danger"
                                size="sm"
                                className="ms-3"
                                onClick={() => handleRemove(item.id)}
                            >
                                &times;
                            </Button>
                        </div>
                    </ListGroup.Item>
                ))}
            </ListGroup>

            <AddressManager userId={userId} onAddressSelect={setSelectedAddress} />

            <Row className="justify-content-between mt-4">
                <Col>
                    <h5>Total: {totalAmount} ETH</h5>
                </Col>
                <Col className="text-end">
                    <Button variant="primary" size="lg" onClick={handleMakeOrder}>
                        Proceed to Payment
                    </Button>
                </Col>
            </Row>

           
        </Container>
    );
}

export default MakeOrder;


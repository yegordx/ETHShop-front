import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AuthContext } from '../Contexts/AuthProvider';
import { Container, Row, Col, Card, ListGroup, Button, ListGroupItem, Modal, Form } from 'react-bootstrap';
import ReviewCard from '../Review/ReviewCard';
import CreateProductModal from '../Product/CreateProductModal';
import EditSeller from './EditSeller';

export default function SellerProfile() {
    const { apiRequest, userId } = useContext(AuthContext);
    const [sellerData, setSellerData] = useState(null);
    const { sellerId } = useParams();
    const [showProductModal, setShowProductModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [newProductData, setNewProductData] = useState({ Name: '', Description: '', PriceEth: 0 });
    const [reviews, setReviews] = useState([]);

    const [showEditSellerModal, setShowEditSellerModal] = useState(false);

    const handleOpenEditSellerModal = () => setShowEditSellerModal(true);
    const handleCloseEditSellerModal = () => setShowEditSellerModal(false);

    const navigate = useNavigate();

    async function fetchSellerData() {
        try {
            const response = await apiRequest('GET', `api/sellers/${sellerId}`);
            setSellerData(response);
        } catch (error) {
            console.error('Failed to fetch seller data:', error);
        }
    }

    const handleDeleteProduct = async (productId) => {
        try {
            await apiRequest('DELETE', `api/products/${productId}`);
            fetchSellerData();
        } catch (error) {
            console.error('Failed to delete product:', error);
        }
    };

    const handleEditProduct = (product) => {
        setSelectedProduct(product);
        setNewProductData({
            Name: product.productName,
            Description: product.description,
            PriceEth: product.priceETH,
        });
        setShowEditModal(true);
    };

    const handleSaveChanges = async () => {
        if (selectedProduct) {
            await updateProductData(selectedProduct.id, newProductData);
            setShowEditModal(false);
            setSelectedProduct(null);
            fetchSellerData(); // Оновити список продуктів після редагування
        }
    };

    async function updateProductData(productId, newProductData) {
        try {
            await apiRequest('PUT', `api/products/${productId}`, {
                ProductName: newProductData.Name,
                Description: newProductData.Description,
                PriceETH: newProductData.PriceEth,
            });
        } catch (error) {
            console.error('Failed to update product:', error);
        }
    }

    async function fetchReviewsData() {
        try {
            const response = await apiRequest('GET', `api/reviews`, {
                sellerId: sellerId,
            });
            setReviews(response);
        } catch (error) {
            console.error('Failed to fetch reviews:', error);
        }
    }

    async function updateSellerData(id, newSellerData){
        try {
            await apiRequest('PUT', `api/sellers/${id}`, {
                StoreName: newSellerData.StoreName,
                StoreDescription: newSellerData.Description,
                ContactEmail: newSellerData.Email,
                ContactPhone: newSellerData.Phone
            });
        } catch (error) {
            console.error('Failed to update seller data:', error);
        }
    } 

    useEffect(() => {
        if (sellerId) {
            fetchSellerData();
            fetchReviewsData();
        }
    }, [userId]);

    const handleShowProductModal = () => setShowProductModal(true);
    const handleCloseProductModal = () => setShowProductModal(false);

    const handleCreateProduct = async (newProductData) => {
        try {
            await apiRequest('POST', 'api/products', {
                sellerID: sellerId,
                ...newProductData,
            });
            fetchSellerData();
        } catch (error) {
            console.error('Failed to create product:', error);
        }
    };

    if (!sellerData) {
        return <p>Loading...</p>;
    }

    const handleViewDetails = (productId) => {
        navigate(`/Product/${productId}`);
    };

    return (
        <Container className="mt-5" style={{ minHeight: '100vh' }}>
            <Row>
                <Col md={4}>
                    <Card>
                        <Card.Body>
                            <Card.Title>Store Information</Card.Title>
                            <ListGroup variant="flush">
                            <Button variant="primary" onClick={handleOpenEditSellerModal}>
                                Edit Store
                            </Button>
                            <EditSeller
                                show={showEditSellerModal}
                                handleClose={handleCloseEditSellerModal}
                                sellerData={sellerData}
                                updateSellerData={updateSellerData}
                            />
                                <ListGroup.Item><strong>Store Name:</strong> {sellerData.storeName}</ListGroup.Item>
                                <ListGroup.Item><strong>Description:</strong> {sellerData.description}</ListGroup.Item>
                                <ListGroup.Item><strong>Email:</strong> {sellerData.email}</ListGroup.Item>
                                <ListGroup.Item><strong>Phone Number:</strong> {sellerData.phoneNumber}</ListGroup.Item>
                            </ListGroup>
                        </Card.Body>
                    </Card>
                </Col>

                <Col md={8}>
                    <Card className="mb-4">
                        <Card.Body>
                            <Card.Title>Products</Card.Title>
                            {userId === sellerId && (
                                <Button variant="primary" className="mb-3" onClick={handleShowProductModal}>
                                    Add New Product
                                </Button>
                            )}
                            {sellerData.products && sellerData.products.length > 0 ? (
                                <ListGroup variant="flush">
                                    {sellerData.products.map((product) => (
                                        <ListGroup.Item key={product.id}>
                                            <span onClick={() => handleViewDetails(product.id)} style={{ cursor: 'pointer', color: 'black', textDecoration: 'none' }}>
                                                <strong>Product Name:</strong> {product.productName} - 
                                                <strong> Description:</strong> {product.description} - 
                                                <strong> Price:</strong> {product.priceETH} ETH
                                            </span>
                                            {userId === sellerId && (
                                                <>
                                                    <Button 
                                                        variant="danger" 
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleDeleteProduct(product.id);
                                                        }} 
                                                        style={{ float: 'right', marginLeft: '10px' }}
                                                    >
                                                        Delete
                                                    </Button>
                                                    <Button 
                                                        variant="secondary" 
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleEditProduct(product);
                                                        }} 
                                                        style={{ float: 'right' }}
                                                    >
                                                        Edit
                                                    </Button>
                                                </>
                                            )}
                                        </ListGroup.Item>
                                    ))}
                                </ListGroup>
                            ) : (
                                <p>No products found.</p>
                            )}
                        </Card.Body>
                    </Card>
                </Col>

                <ListGroup>
                    <ListGroupItem>
                        <ReviewCard reviews={reviews} />
                    </ListGroupItem>
                </ListGroup>
            </Row>

            <CreateProductModal 
                show={showProductModal} 
                handleClose={handleCloseProductModal} 
                handleCreateProduct={handleCreateProduct} 
            />

            <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Product</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="productName">
                            <Form.Label>Product Name</Form.Label>
                            <Form.Control
                                type="text"
                                value={newProductData.Name}
                                onChange={(e) => setNewProductData({ ...newProductData, Name: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group controlId="productDescription">
                            <Form.Label>Description</Form.Label>
                            <Form.Control
                                type="text"
                                value={newProductData.Description}
                                onChange={(e) => setNewProductData({ ...newProductData, Description: e.target.value })}
                            />
                        </Form.Group>
                        <Form.Group controlId="productPrice">
                            <Form.Label>Price (ETH)</Form.Label>
                            <Form.Control
                                type="number"
                                value={newProductData.PriceEth}
                                onChange={(e) => setNewProductData({ ...newProductData, PriceEth: parseFloat(e.target.value) })}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowEditModal(false)}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={handleSaveChanges}>
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
}




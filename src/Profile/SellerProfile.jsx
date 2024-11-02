import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../Contexts/AuthProvider'; // Ваш контекст
import { Card, Container, Row, Col, Button, Modal, Form } from 'react-bootstrap';

export default function SellerProfile() {
    const { apiRequest, userId } = useContext(AuthContext); // currentUser для перевірки власника сторінки
    const [sellerData, setSellerData] = useState(null);
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');
    const [showModal, setShowModal] = useState(false); // Для керування модальним вікном
    const [newProduct, setNewProduct] = useState({ name: '', description: '', priceETH: '', categoryId: '' }); // Поля для нового товару
    const navigate = useNavigate();

    useEffect(() => {
        const fetchSellerData = async () => {
            try {
                console.log(userId);
                const response = await apiRequest('GET', `api/sellers/${userId}`);
                setSellerData(response); // Зберігаємо інформацію про продавця
                setProducts(response.products); // Зберігаємо товари продавця
            } catch (error) {
                console.error('Error:', error);
                setErrorMessage('An error occurred while fetching seller data.');
            }
        };

        fetchSellerData();
    }, [apiRequest, userId]);

    const handleAddProduct = async () => {
        try {
            const response = await apiRequest('GET', 'api/categories');
            setCategories(response); // Зберігаємо категорії
            setShowModal(true); // Відкриваємо модальне вікно
        } catch (error) {
            console.error('Error:', error);
            setErrorMessage('An error occurred while fetching categories.');
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewProduct(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmitProduct = async () => {
        // Виконати запит на створення товару
        console.log("New product data:", newProduct);
        // Додайте логіку для створення товару
        setShowModal(false); // Закрити модальне вікно після підтвердження
    };

    if (!sellerData) {
        return <p>Loading...</p>;
    }

    return (
        <Container className="mt-5">
            {errorMessage && <p className="text-danger">{errorMessage}</p>}
            <Row>
                {/* Особиста інформація продавця */}
                <Col md={4}>
                    <div className="border p-3">
                        <h4>{sellerData.name}</h4>
                        <p>Email: {sellerData.email}</p>
                        <p>Телефон: {sellerData.phone}</p>
                        <p>Адреса: {sellerData.address}</p>
                    </div>
                </Col>

                {/* Товари, які продає продавець */}
                <Col md={8}>
                    <h4>Товари продавця</h4>
                    <Row>
                        {products.map(product => (
                            <Col md={6} className="mb-4" key={product.id}>
                                <Card>
                                    <Card.Img variant="top" src={product.imageUrl} />
                                    <Card.Body>
                                        <Card.Title>{product.name}</Card.Title>
                                        <Card.Text>Ціна: {product.price} $</Card.Text>
                                        <button className="btn btn-primary">Додати до кошика</button>
                                    </Card.Body>
                                </Card>
                            </Col>
                        ))}
                    </Row>

                    {/* Кнопка для додавання товару (тільки для власника сторінки) */}
                    {currentUser?.userId === sellerData.sellerID ? (
                        <Button variant="success" onClick={handleAddProduct}>Add Product</Button>
                    ) : null}
                </Col>
            </Row>

            {/* Модальне вікно для додавання нового товару */}
            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Додати новий товар</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="productName">
                            <Form.Label>Назва товару</Form.Label>
                            <Form.Control
                                type="text"
                                name="name"
                                value={newProduct.name}
                                onChange={handleInputChange}
                                placeholder="Введіть назву товару"
                            />
                        </Form.Group>

                        <Form.Group controlId="productDescription">
                            <Form.Label>Опис</Form.Label>
                            <Form.Control
                                as="textarea"
                                name="description"
                                value={newProduct.description}
                                onChange={handleInputChange}
                                rows={3}
                                placeholder="Опис товару"
                            />
                        </Form.Group>

                        <Form.Group controlId="productPrice">
                            <Form.Label>Ціна в ETH</Form.Label>
                            <Form.Control
                                type="text"
                                name="priceETH"
                                value={newProduct.priceETH}
                                onChange={handleInputChange}
                                placeholder="Введіть ціну в ETH"
                            />
                        </Form.Group>

                        <Form.Group controlId="productCategory">
                            <Form.Label>Категорія</Form.Label>
                            <Form.Control
                                as="select"
                                name="categoryId"
                                value={newProduct.categoryId}
                                onChange={handleInputChange}
                            >
                                <option>Оберіть категорію</option>
                                {categories.map(category => (
                                    <option key={category.id} value={category.id}>
                                        {category.name}
                                    </option>
                                ))}
                            </Form.Control>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        Закрити
                    </Button>
                    <Button variant="primary" onClick={handleSubmitProduct}>
                        Підтвердити
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
}


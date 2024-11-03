// CreateProductModal.js
import React, {useContext, useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { AuthContext } from '../Contexts/AuthProvider'; // Ваш контекст

const CreateProductModal = ({ show, handleClose, handleCreateProduct }) => {
    const { apiRequest, userId } = useContext(AuthContext);

    const [newProductData, setNewProductData] = useState({
        categoryName: '',
        productName: '',
        description: '',
        priceETH: ''
    });
    const [categories, setCategories] = useState([]);

    // Отримання категорій з сервера
    useEffect(() => {
        async function getCategories() {
            try {
                const response = await apiRequest('GET', 'api/categories');
                setCategories(response);
            } catch (error) {
                console.error('Failed to fetch categories:', error);
            }
        }
        getCategories();
    }, [apiRequest]);

    // Обробник для оновлення полів нового продукту
    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setNewProductData((prevData) => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleSubmit = () => {
        handleCreateProduct(newProductData);
        handleClose();
    };

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Create New Product</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group controlId="categoryName">
                        <Form.Label>Category Name</Form.Label>
                        <Form.Control
                            as="select"
                            name="categoryName"
                            value={newProductData.categoryName}
                            onChange={handleInputChange}
                        >
                            <option value="">Select Category</option>
                            {categories.map((category) => (
                                <option key={category.categoryID} value={category.categoryName}>
                                    {category.categoryName}
                                </option>
                            ))}
                        </Form.Control>
                    </Form.Group>
                    <Form.Group controlId="productName">
                        <Form.Label>Product Name</Form.Label>
                        <Form.Control
                            type="text"
                            name="productName"
                            value={newProductData.productName}
                            onChange={handleInputChange}
                            placeholder="Enter product name"
                        />
                    </Form.Group>
                    <Form.Group controlId="description">
                        <Form.Label>Description</Form.Label>
                        <Form.Control
                            type="text"
                            name="description"
                            value={newProductData.description}
                            onChange={handleInputChange}
                            placeholder="Enter product description"
                        />
                    </Form.Group>
                    <Form.Group controlId="priceETH">
                        <Form.Label>Price (ETH)</Form.Label>
                        <Form.Control
                            type="number"
                            name="priceETH"
                            value={newProductData.priceETH}
                            onChange={handleInputChange}
                            placeholder="Enter price in ETH"
                        />
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Cancel
                </Button>
                <Button variant="primary" onClick={handleSubmit}>
                    Create Product
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default CreateProductModal;

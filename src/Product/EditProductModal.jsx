import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

export default function EditProductModal({ show, handleClose, selectedProduct, handleSaveChanges }) {
    const [newProductData, setNewProductData] = useState({
        Name: '',
        Description: '',
        PriceEth: 0,
    });

    useEffect(() => {
        if (selectedProduct) {
            setNewProductData({
                Name: selectedProduct.productName,
                Description: selectedProduct.description,
                PriceEth: selectedProduct.priceETH,
            });
        }
    }, [selectedProduct]);

    const handleProductChange = (e) => {
        const { name, value } = e.target;
        setNewProductData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = () => {
        handleSaveChanges(newProductData);
        handleClose();
    };

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Edit Product</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group controlId="productName">
                        <Form.Label>Product Name</Form.Label>
                        <Form.Control
                            type="text"
                            name="Name"
                            value={newProductData.Name}
                            onChange={handleProductChange}
                        />
                    </Form.Group>
                    <Form.Group controlId="productDescription">
                        <Form.Label>Description</Form.Label>
                        <Form.Control
                            type="text"
                            name="Description"
                            value={newProductData.Description}
                            onChange={handleProductChange}
                        />
                    </Form.Group>
                    <Form.Group controlId="productPrice">
                        <Form.Label>Price (ETH)</Form.Label>
                        <Form.Control
                            type="number"
                            name="PriceEth"
                            value={newProductData.PriceEth}
                            onChange={handleProductChange}
                        />
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Cancel
                </Button>
                <Button variant="primary" onClick={handleSubmit}>
                    Save Changes
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

import React, { useState, useContext } from 'react';
import { Card, ListGroup, Button, Modal, Form } from 'react-bootstrap';
import { AuthContext } from '../Contexts/AuthProvider';

function EditShippingAddress({ address }) {
    const [showModal, setShowModal] = useState(false);
    const [currentAddress, setCurrentAddress] = useState(address);
    const { apiRequest } = useContext(AuthContext);
    
    const handleEditClick = () => {
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    const handleFormChange = (event) => {
        const { name, value } = event.target;
        setCurrentAddress((prevAddress) => ({
            ...prevAddress,
            [name]: value,
        }));
    };

    const handleFormSubmit = async (event) => {
        event.preventDefault();
        await apiRequest('PUT', `api/addresses/${currentAddress.addressId}`, currentAddress);
        handleCloseModal();
    };

    return (
        <Card className="mb-4">
            <Card.Body>
                <Card.Title>Shipping Address</Card.Title>
                <div>
                    <strong>Address:</strong> {currentAddress.addressLine}, {currentAddress.city}, {currentAddress.country} - {currentAddress.postalCode}
                </div>
                <Button variant="outline-primary" size="sm" onClick={handleEditClick} className="mt-2">
                    Edit
                </Button>
            </Card.Body>

            {/* Modal for editing address */}
            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Shipping Address</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleFormSubmit}>
                        <Form.Group controlId="formName">
                            <Form.Label>Name</Form.Label>
                            <Form.Control
                                type="text"
                                name="name"
                                required
                                value={currentAddress.name || ''}
                                onChange={handleFormChange}
                            />
                        </Form.Group>
                        <Form.Group controlId="formSurname">
                            <Form.Label>Surname</Form.Label>
                            <Form.Control
                                type="text"
                                name="surname"
                                required
                                value={currentAddress.surname || ''}
                                onChange={handleFormChange}
                            />
                        </Form.Group>
                        <Form.Group controlId="formCountry">
                            <Form.Label>Country</Form.Label>
                            <Form.Control
                                type="text"
                                name="country"
                                required
                                value={currentAddress.country || ''}
                                onChange={handleFormChange}
                            />
                        </Form.Group>
                        <Form.Group controlId="formCity">
                            <Form.Label>City</Form.Label>
                            <Form.Control
                                type="text"
                                name="city"
                                required
                                value={currentAddress.city || ''}
                                onChange={handleFormChange}
                            />
                        </Form.Group>
                        <Form.Group controlId="formAddressLine">
                            <Form.Label>Address Line</Form.Label>
                            <Form.Control
                                type="text"
                                name="addressLine"
                                required
                                value={currentAddress.addressLine || ''}
                                onChange={handleFormChange}
                            />
                        </Form.Group>
                        <Form.Group controlId="formPostalCode">
                            <Form.Label>Postal Code</Form.Label>
                            <Form.Control
                                type="text"
                                name="postalCode"
                                value={currentAddress.postalCode || ''}
                                onChange={handleFormChange}
                            />
                        </Form.Group>
                        <Button variant="primary" type="submit" className="mt-3">
                            Save Changes
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>
        </Card>
    );
}

export default EditShippingAddress;

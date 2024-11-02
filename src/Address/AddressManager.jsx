import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../Contexts/AuthProvider';
import { Form, Button, Modal } from 'react-bootstrap';

function AddressManager({ userId, onAddressSelect }) {
    const [addresses, setAddresses] = useState([]);
    const [selectedAddress, setSelectedAddress] = useState('');
    const [showAddressModal, setShowAddressModal] = useState(false);
    const [newAddress, setNewAddress] = useState({
        name: '',
        surname: '',
        country: '',
        city: '',
        addressLine: '',
        postalCode: ''
    });
    const { apiRequest } = useContext(AuthContext);

    async function fetchAddressData() {
        try {
            const response = await apiRequest('GET', `api/addresses/${userId}/all`);
            setAddresses(response);
        } catch (error) {
            console.error("Error fetching addresses:", error);
        }
    }

    useEffect(() => {
        if (userId) {
            fetchAddressData();
        }
    }, [userId]);

    const handleAddNewAddress = async () => {
        try {
            const response = await apiRequest('POST', `api/addresses/${userId}`, {
                ...newAddress
            });
            setAddresses([...addresses, response]);
            setShowAddressModal(false);
            setSelectedAddress(response.id);
            onAddressSelect(response.id); // Оновлення вибраної адреси
            setNewAddress({ name: '', surname: '', country: '', city: '', addressLine: '', postalCode: '' }); // Скидання форми
        } catch (error) {
            console.error("Error adding new address:", error);
        }
    };

    const handleAddressSelect = (addressId) => {
        setSelectedAddress(addressId);
        onAddressSelect(addressId); // Оновлення вибраної адреси
    };

    return (
        <>
            <Form.Group controlId="deliveryAddress">
                <Form.Label>Delivery Address</Form.Label>
                <Form.Select
                    value={selectedAddress}
                    onChange={(e) => {
                        const value = e.target.value;
                        if (value === "addNew") {
                            setShowAddressModal(true);
                        } else {
                            handleAddressSelect(value);
                        }
                    }}
                >
                    <option value="">Select an address</option>
                    {addresses.map((address) => (
                        <option key={address.id} value={address.id}>
                            {address.addressLine}, {address.city}, {address.country}, {address.postalCode}
                        </option>
                    ))}
                    <option value="addNew">+ Add New Address</option>
                </Form.Select>
            </Form.Group>

            {/* Модальне вікно для додавання нової адреси */}
            <Modal show={showAddressModal} onHide={() => setShowAddressModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Add New Address</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="formName">
                            <Form.Label>Name</Form.Label>
                            <Form.Control
                                type="text"
                                value={newAddress.name}
                                onChange={(e) => setNewAddress({ ...newAddress, name: e.target.value })}
                                required
                                placeholder="Enter your name"
                            />
                        </Form.Group>
                        <Form.Group controlId="formSurname" className="mt-3">
                            <Form.Label>Surname</Form.Label>
                            <Form.Control
                                type="text"
                                value={newAddress.surname}
                                onChange={(e) => setNewAddress({ ...newAddress, surname: e.target.value })}
                                required
                                placeholder="Enter your surname"
                            />
                        </Form.Group>
                        <Form.Group controlId="formCountry" className="mt-3">
                            <Form.Label>Country</Form.Label>
                            <Form.Control
                                type="text"
                                value={newAddress.country}
                                onChange={(e) => setNewAddress({ ...newAddress, country: e.target.value })}
                                required
                                placeholder="Enter your country"
                            />
                        </Form.Group>
                        <Form.Group controlId="formCity" className="mt-3">
                            <Form.Label>City</Form.Label>
                            <Form.Control
                                type="text"
                                value={newAddress.city}
                                onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                                required
                                placeholder="Enter your city"
                            />
                        </Form.Group>
                        <Form.Group controlId="formAddressLine" className="mt-3">
                            <Form.Label>Address Line</Form.Label>
                            <Form.Control
                                type="text"
                                value={newAddress.addressLine}
                                onChange={(e) => setNewAddress({ ...newAddress, addressLine: e.target.value })}
                                required
                                placeholder="Enter your address line"
                            />
                        </Form.Group>
                        <Form.Group controlId="formPostalCode" className="mt-3">
                            <Form.Label>Postal Code</Form.Label>
                            <Form.Control
                                type="text"
                                value={newAddress.postalCode}
                                onChange={(e) => setNewAddress({ ...newAddress, postalCode: e.target.value })}
                                placeholder="Enter your postal code"
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowAddressModal(false)}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={handleAddNewAddress}>
                        Save Address
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default AddressManager;



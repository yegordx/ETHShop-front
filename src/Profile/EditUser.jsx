import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { useContext } from 'react';
import { AuthContext } from '../Contexts/AuthProvider';

export default function EditUser({ userData, onClose }) {
    const { apiRequest } = useContext(AuthContext);
    const [newUserData, setNewUserData] = useState({
        UserName: userData.userName,
        Email: userData.email,
        Password: '', // Assuming password will be updated by the user
        WalletAddress: userData.walletAddress || '' // Optional if not provided
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewUserData(prevState => ({ ...prevState, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await apiRequest('PUT', `api/users/${userData.id}`, newUserData);
            onClose(); // Close the modal after successful update
        } catch (error) {
            console.error('Failed to update user:', error);
        }
    };

    return (
        <Modal show={true} onHide={onClose}>
            <Modal.Header closeButton>
                <Modal.Title>Edit User</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit}>
                    <Form.Group controlId="formUserName">
                        <Form.Label>Username</Form.Label>
                        <Form.Control
                            type="text"
                            name="UserName"
                            value={newUserData.UserName}
                            onChange={handleChange}
                            required
                        />
                    </Form.Group>
                    <Form.Group controlId="formEmail">
                        <Form.Label>Email</Form.Label>
                        <Form.Control
                            type="email"
                            name="Email"
                            value={newUserData.Email}
                            onChange={handleChange}
                            required
                        />
                    </Form.Group>
                    <Form.Group controlId="formPassword">
                        <Form.Label>Password</Form.Label>
                        <Form.Control
                            type="password"
                            name="Password"
                            value={newUserData.Password}
                            onChange={handleChange}
                        />
                    </Form.Group>
                    <Form.Group controlId="formWalletAddress">
                        <Form.Label>Wallet Address</Form.Label>
                        <Form.Control
                            type="text"
                            name="WalletAddress"
                            value={newUserData.WalletAddress}
                            onChange={handleChange}
                        />
                    </Form.Group>
                    <Button variant="primary" type="submit">Save Changes</Button>
                </Form>
            </Modal.Body>
        </Modal>
    );
}
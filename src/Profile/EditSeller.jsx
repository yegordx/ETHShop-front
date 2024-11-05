import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

export default function EditSeller({ show, handleClose, sellerData, updateSellerData }) {
  const [formData, setFormData] = useState({
    StoreName: sellerData?.StoreName || '',
    Description: sellerData?.StoreDescription || '',
    Email: sellerData?.ContactEmail || '',
    Phone: sellerData?.ContactPhone || '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async () => {
    await updateSellerData(sellerData.SellerId, formData);
    handleClose();
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Edit Seller Data</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="formStoreName">
            <Form.Label>Store Name</Form.Label>
            <Form.Control
              type="text"
              name="StoreName"
              value={formData.StoreName}
              onChange={handleChange}
              placeholder={sellerData.StoreName}
            />
          </Form.Group>
          <Form.Group controlId="formDescription" className="mt-3">
            <Form.Label>Store Description</Form.Label>
            <Form.Control
              as="textarea"
              name="Description"
              value={formData.Description}
              onChange={handleChange}
              placeholder="Enter store description"
            />
          </Form.Group>
          <Form.Group controlId="formEmail" className="mt-3">
            <Form.Label>Contact Email</Form.Label>
            <Form.Control
              type="email"
              name="Email"
              value={formData.Email}
              onChange={handleChange}
              placeholder="Enter contact email"
            />
          </Form.Group>
          <Form.Group controlId="formPhone" className="mt-3">
            <Form.Label>Contact Phone</Form.Label>
            <Form.Control
              type="tel"
              name="Phone"
              value={formData.Phone}
              onChange={handleChange}
              placeholder="Enter contact phone"
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


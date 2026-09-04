import React, { useState } from 'react';
import { Form, Button, Alert, Row, Col } from 'react-bootstrap';
import type { ApiResponse } from '../types/api';

/**
 * PersonRegistration Component
 * 
 * Provides a UI to register a person along with their contact information.
 * Enforces business rules defined in the backend (.NET Test Requirement 14).
 * 
 * @returns {React.JSX.Element} The rendered Person Registration form.
 */
const PersonRegistration: React.FC = () => {
    const [formData, setFormData] = useState({
        documentId: '',
        firstName: '',
        lastName: '',
        birthDate: ''
    });

    const [contacts, setContacts] = useState<{type: string, value: string}[]>([]);
    const [contactType, setContactType] = useState('Phone');
    const [contactValue, setContactValue] = useState('');

    const [error, setError] = useState<string | null>(null);
    const [errorDetails, setErrorDetails] = useState<string[]>([]);
    const [success, setSuccess] = useState<string | null>(null);

    /**
     * Adds a new contact to the local component state.
     */
    const handleAddContact = () => {
        if (!contactValue) return;
        setContacts([...contacts, { type: contactType, value: contactValue }]);
        setContactValue('');
    };

    /**
     * Removes a contact from the local component state by its index.
     * @param {number} index The array index of the contact to remove.
     */
    const handleRemoveContact = (index: number) => {
        const newContacts = [...contacts];
        newContacts.splice(index, 1);
        setContacts(newContacts);
    };

    /**
     * Submits the form data to the backend API.
     * @param {React.FormEvent} e The form submit event.
     */
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setErrorDetails([]);
        setSuccess(null);

        const payload = {
            ...formData,
            contacts: contacts
        };

        try {
            const response = await fetch('http://localhost:5000/api/persons', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const result: ApiResponse<any> = await response.json().catch(() => ({
                success: false,
                message: "Could not parse server response.",
                errors: []
            }));

            if (!response.ok || !result.success) {
                setError(result.message || 'Unknown error while registering person');
                if (result.errors && result.errors.length > 0) {
                    setErrorDetails(result.errors);
                }
            } else {
                setSuccess(result.message || 'Person registered successfully.');
                setFormData({ documentId: '', firstName: '', lastName: '', birthDate: '' });
                setContacts([]);
            }
        } catch (err: any) {
            setError(err.message || 'Connection error');
        }
    };

    return (
        <div>
            <h2>Person Registration</h2>
            <p>Implementation of requirement 14 of the .NET test.</p>

            {error && (
                <Alert variant="danger">
                    {error}
                    {errorDetails.length > 0 && (
                        <ul className="mb-0 mt-2">
                            {errorDetails.map((err, i) => <li key={i}>{err}</li>)}
                        </ul>
                    )}
                </Alert>
            )}
            {success && <Alert variant="success">{success}</Alert>}

            <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                    <Form.Label>Document ID (Alphanumeric)</Form.Label>
                    <Form.Control type="text" value={formData.documentId} onChange={e => setFormData({...formData, documentId: e.target.value})} required />
                </Form.Group>

                <Row>
                    <Col>
                        <Form.Group className="mb-3">
                            <Form.Label>First Name (No numbers)</Form.Label>
                            <Form.Control type="text" value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})} required />
                        </Form.Group>
                    </Col>
                    <Col>
                        <Form.Group className="mb-3">
                            <Form.Label>Last Name (No numbers)</Form.Label>
                            <Form.Control type="text" value={formData.lastName} onChange={e => setFormData({...formData, lastName: e.target.value})} required />
                        </Form.Group>
                    </Col>
                </Row>

                <Form.Group className="mb-3">
                    <Form.Label>Birth Date</Form.Label>
                    <Form.Control type="date" value={formData.birthDate} onChange={e => setFormData({...formData, birthDate: e.target.value})} required />
                </Form.Group>

                <h4>Contact Information</h4>
                <p className="text-muted">Maximum 2 phones, 2 emails, 2 physical addresses</p>
                
                <Row className="mb-3">
                    <Col md={4}>
                        <Form.Select value={contactType} onChange={e => setContactType(e.target.value)}>
                            <option value="Phone">Phone</option>
                            <option value="Email">Email</option>
                            <option value="Address">Physical Address</option>
                        </Form.Select>
                    </Col>
                    <Col md={6}>
                        <Form.Control type="text" placeholder="Value" value={contactValue} onChange={e => setContactValue(e.target.value)} />
                    </Col>
                    <Col md={2}>
                        <Button variant="secondary" onClick={handleAddContact}>Add</Button>
                    </Col>
                </Row>

                <ul>
                    {contacts.map((c, i) => (
                        <li key={i}>{c.type}: {c.value} <Button variant="link" size="sm" onClick={() => handleRemoveContact(i)}>X</Button></li>
                    ))}
                </ul>

                <Button variant="primary" type="submit">
                    Register Person
                </Button>
            </Form>
        </div>
    );
};

export default PersonRegistration;

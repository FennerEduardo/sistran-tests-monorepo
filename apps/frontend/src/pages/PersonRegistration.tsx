import React, { useState } from 'react';
import { Form, Button, Alert, Row, Col } from 'react-bootstrap';
import { ApiResponse } from '../types/api';

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

    const handleAddContact = () => {
        if (!contactValue) return;
        setContacts([...contacts, { type: contactType, value: contactValue }]);
        setContactValue('');
    };

    const handleRemoveContact = (index: number) => {
        const newContacts = [...contacts];
        newContacts.splice(index, 1);
        setContacts(newContacts);
    };

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
                message: "No se pudo interpretar la respuesta del servidor.",
                errors: []
            }));

            if (!response.ok || !result.success) {
                setError(result.message || 'Error desconocido al registrar persona');
                if (result.errors && result.errors.length > 0) {
                    setErrorDetails(result.errors);
                }
            } else {
                setSuccess(result.message || 'Persona registrada exitosamente.');
                setFormData({ documentId: '', firstName: '', lastName: '', birthDate: '' });
                setContacts([]);
            }
        } catch (err: any) {
            setError(err.message || 'Error de conexión');
        }
    };

    return (
        <div>
            <h2>Registro de Personas</h2>
            <p>Implementación del requerimiento 14 de la prueba .NET.</p>

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
                    <Form.Label>Documento de Identidad (Alfanumérico)</Form.Label>
                    <Form.Control type="text" value={formData.documentId} onChange={e => setFormData({...formData, documentId: e.target.value})} required />
                </Form.Group>

                <Row>
                    <Col>
                        <Form.Group className="mb-3">
                            <Form.Label>Nombres (Sin números)</Form.Label>
                            <Form.Control type="text" value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})} required />
                        </Form.Group>
                    </Col>
                    <Col>
                        <Form.Group className="mb-3">
                            <Form.Label>Apellidos (Sin números)</Form.Label>
                            <Form.Control type="text" value={formData.lastName} onChange={e => setFormData({...formData, lastName: e.target.value})} required />
                        </Form.Group>
                    </Col>
                </Row>

                <Form.Group className="mb-3">
                    <Form.Label>Fecha de Nacimiento</Form.Label>
                    <Form.Control type="date" value={formData.birthDate} onChange={e => setFormData({...formData, birthDate: e.target.value})} required />
                </Form.Group>

                <h4>Información de Contacto</h4>
                <p className="text-muted">Máximo 2 teléfonos, 2 correos, 2 direcciones</p>
                
                <Row className="mb-3">
                    <Col md={4}>
                        <Form.Select value={contactType} onChange={e => setContactType(e.target.value)}>
                            <option value="Phone">Teléfono</option>
                            <option value="Email">Correo Electrónico</option>
                            <option value="Address">Dirección Física</option>
                        </Form.Select>
                    </Col>
                    <Col md={6}>
                        <Form.Control type="text" placeholder="Valor" value={contactValue} onChange={e => setContactValue(e.target.value)} />
                    </Col>
                    <Col md={2}>
                        <Button variant="secondary" onClick={handleAddContact}>Agregar</Button>
                    </Col>
                </Row>

                <ul>
                    {contacts.map((c, i) => (
                        <li key={i}>{c.type}: {c.value} <Button variant="link" size="sm" onClick={() => handleRemoveContact(i)}>X</Button></li>
                    ))}
                </ul>

                <Button variant="primary" type="submit">
                    Registrar Persona
                </Button>
            </Form>
        </div>
    );
};

export default PersonRegistration;

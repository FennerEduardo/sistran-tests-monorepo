import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardHeader, CardBody, CardFooter } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
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
    const { t } = useTranslation();
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
    const [isSubmitting, setIsSubmitting] = useState(false);

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
        setIsSubmitting(true);

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
                setError(result.message || t('form.error'));
                if (result.errors && result.errors.length > 0) {
                    setErrorDetails(result.errors);
                }
            } else {
                setSuccess(result.message || t('form.success'));
                setFormData({ documentId: '', firstName: '', lastName: '', birthDate: '' });
                setContacts([]);
            }
        } catch (err: any) {
            setError(err.message || 'Connection error');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Card className="mb-4">
            <CardHeader>{t('form.title')}</CardHeader>
            <CardBody>
                <p className="mb-4">{t('form.description')}</p>

                {error && (
                    <div style={{ backgroundColor: 'var(--color-error)', color: '#fff', padding: '1rem', borderRadius: 'var(--radius-md)', marginBottom: '1rem' }}>
                        {error}
                        {errorDetails.length > 0 && (
                            <ul style={{ margin: '0.5rem 0 0 1rem' }}>
                                {errorDetails.map((err, i) => <li key={i}>{err}</li>)}
                            </ul>
                        )}
                    </div>
                )}
                {success && (
                    <div style={{ backgroundColor: 'var(--color-success)', color: '#fff', padding: '1rem', borderRadius: 'var(--radius-md)', marginBottom: '1rem' }}>
                        {success}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <Input 
                        label="Document ID (Alphanumeric)" 
                        type="text" 
                        value={formData.documentId} 
                        onChange={e => setFormData({...formData, documentId: e.target.value})} 
                        required 
                    />

                    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
                        <div style={{ flex: '1 1 250px' }}>
                            <Input 
                                label={`${t('form.firstName')} (No numbers)`}
                                type="text" 
                                value={formData.firstName} 
                                onChange={e => setFormData({...formData, firstName: e.target.value})} 
                                required 
                            />
                        </div>
                        <div style={{ flex: '1 1 250px' }}>
                            <Input 
                                label={`${t('form.lastName')} (No numbers)`}
                                type="text" 
                                value={formData.lastName} 
                                onChange={e => setFormData({...formData, lastName: e.target.value})} 
                                required 
                            />
                        </div>
                    </div>

                    <div style={{ marginBottom: '1rem' }}>
                        <Input 
                            label={t('form.birthDate')}
                            type="date" 
                            value={formData.birthDate} 
                            onChange={e => setFormData({...formData, birthDate: e.target.value})} 
                            required 
                        />
                    </div>

                    <h4 style={{ marginTop: '2rem', marginBottom: '1rem' }}>Contact Information</h4>
                    <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem' }}>Maximum 2 phones, 2 emails, 2 physical addresses</p>
                    
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-end', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
                        <div style={{ flex: '1 1 150px' }}>
                            <label className="input-label" style={{ display: 'block', marginBottom: 'var(--space-1)' }}>Type</label>
                            <select 
                                className="input-control" 
                                style={{ width: '100%' }}
                                value={contactType} 
                                onChange={e => setContactType(e.target.value)}
                            >
                                <option value="Phone">Phone</option>
                                <option value="Email">Email</option>
                                <option value="Address">Physical Address</option>
                            </select>
                        </div>
                        <div style={{ flex: '2 1 200px' }}>
                            <Input 
                                label="Value"
                                type="text" 
                                placeholder="Value" 
                                value={contactValue} 
                                onChange={e => setContactValue(e.target.value)} 
                                style={{ marginBottom: 0 }}
                            />
                        </div>
                        <div style={{ flex: '0 0 auto', width: '100%', display: 'flex', justifyContent: 'flex-end' }}>
                            <Button type="button" variant="secondary" onClick={handleAddContact}>Add</Button>
                        </div>
                    </div>

                    <ul style={{ listStyleType: 'none', padding: 0, marginBottom: '2rem' }}>
                        {contacts.map((c, i) => (
                            <li key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem', backgroundColor: 'var(--color-background)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-sm)', marginBottom: '0.5rem' }}>
                                <span><strong>{c.type}:</strong> {c.value}</span>
                                <Button type="button" variant="outline" size="sm" onClick={() => handleRemoveContact(i)}>X</Button>
                            </li>
                        ))}
                    </ul>

                    <Button variant="primary" type="submit" isLoading={isSubmitting} disabled={isSubmitting}>
                        {isSubmitting ? t('form.submitting') : t('form.submit')}
                    </Button>
                </form>
            </CardBody>
        </Card>
    );
};

export default PersonRegistration;

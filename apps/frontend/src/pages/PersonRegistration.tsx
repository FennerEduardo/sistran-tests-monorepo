import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardHeader, CardBody, CardFooter } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Select from 'react-select';
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
        birthDate: new Date()
    });

    const [contacts, setContacts] = useState<{type: string, value: string}[]>([]);
    
    const contactOptions = [
        { value: 'Phone', label: t('form.phone') },
        { value: 'Email', label: t('form.email') },
        { value: 'Address', label: t('form.address') }
    ];
    const [contactType, setContactType] = useState(contactOptions[0]);
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

        if (contactType.value === 'Email') {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(contactValue)) {
                setError(t('form.invalidEmail'));
                return;
            }
        } else if (contactType.value === 'Phone') {
            const phoneRegex = /^[\d\s\-\+\(\)]+$/;
            if (!phoneRegex.test(contactValue) || contactValue.length < 5) {
                setError(t('form.invalidPhone'));
                return;
            }
        } else if (contactType.value === 'Address') {
            if (contactValue.length < 5) {
                setError(t('form.invalidAddress'));
                return;
            }
        }

        const currentCount = contacts.filter(c => c.type === contactType.value).length;
        if (currentCount >= 2) {
            setError(t('form.errorLimit'));
            return;
        }

        setError(null);
        setContacts([...contacts, { type: contactType.value, value: contactValue }]);
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
        
        // Enforce requirement: At least one Email or Address
        const hasEmailOrAddress = contacts.some(c => c.type === 'Email' || c.type === 'Address');
        if (!hasEmailOrAddress) {
            setError(t('form.missingContactReq') || 'Debe registrar al menos un correo electrónico o dirección física.');
            return;
        }

        setIsSubmitting(true);

        const payload = {
            ...formData,
            // Convert Date object to YYYY-MM-DD string for backend
            birthDate: formData.birthDate.toISOString().split('T')[0],
            contacts: contacts
        };

        try {
            const response = await fetch('/api/persons', {
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
                setFormData({ documentId: '', firstName: '', lastName: '', birthDate: new Date() });
                setContacts([]);
            }
        } catch (err: any) {
            setError(err.message || 'Connection error');
        } finally {
            setIsSubmitting(false);
        }
    };

    // Custom styles for react-select to match the dark glassmorphic theme
    const selectStyles = {
        control: (base: any) => ({
            ...base,
            backgroundColor: 'var(--color-surface)',
            borderColor: 'var(--color-border)',
            color: 'var(--color-text-primary)',
            padding: '2px', // Adjusted to match the Input component height
            minHeight: '44px',
            borderRadius: 'var(--radius-md)',
            boxShadow: 'none',
            '&:hover': {
                borderColor: 'var(--color-primary)'
            }
        }),
        menu: (base: any) => ({
            ...base,
            backgroundColor: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            zIndex: 100
        }),
        option: (base: any, state: any) => ({
            ...base,
            backgroundColor: state.isFocused ? 'var(--color-primary-light)' : 'transparent',
            color: 'var(--color-text-primary)',
            '&:active': {
                backgroundColor: 'var(--color-primary)'
            }
        }),
        singleValue: (base: any) => ({
            ...base,
            color: 'var(--color-text-primary)'
        })
    };

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <Card className="mb-4">
                <CardHeader>{t('form.title')}</CardHeader>
                <CardBody>
                    <p className="mb-4" style={{ color: 'var(--color-text-secondary)' }}>{t('form.description')}</p>

                    {error && (
                        <div style={{ backgroundColor: 'var(--color-error)', color: '#fff', padding: '1rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem' }}>
                            {error}
                            {errorDetails.length > 0 && (
                                <ul style={{ margin: '0.5rem 0 0 1rem' }}>
                                    {errorDetails.map((err, i) => <li key={i}>{err}</li>)}
                                </ul>
                            )}
                        </div>
                    )}
                    {success && (
                        <div style={{ backgroundColor: 'var(--color-success)', color: '#fff', padding: '1rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem' }}>
                            {success}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
                            <Input 
                                label={t('form.documentId')} 
                                type="text" 
                                value={formData.documentId} 
                                onChange={e => setFormData({...formData, documentId: e.target.value})} 
                                required 
                                pattern="^[a-zA-Z0-9]+$"
                                title="Only alphanumeric characters allowed"
                                className="mb-0"
                            />

                            <div className="input-group mb-0">
                                <label className="input-label" htmlFor="birthDate">
                                    {t('form.birthDate')}
                                </label>
                                <DatePicker 
                                    id="birthDate"
                                    selected={formData.birthDate} 
                                    onChange={(date: Date) => setFormData({...formData, birthDate: date})} 
                                    dateFormat="dd/MM/yyyy"
                                    className="input-control"
                                    wrapperClassName="date-picker-wrapper"
                                    required
                                />
                            </div>

                            <Input 
                                label={`${t('form.firstName')} ${t('form.noNumbers')}`}
                                type="text" 
                                value={formData.firstName} 
                                onChange={e => setFormData({...formData, firstName: e.target.value})} 
                                required 
                                pattern="^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$"
                                title="Only alphabetical characters allowed"
                                className="mb-0"
                            />

                            <Input 
                                label={`${t('form.lastName')} ${t('form.noNumbers')}`}
                                type="text" 
                                value={formData.lastName} 
                                onChange={e => setFormData({...formData, lastName: e.target.value})} 
                                required 
                                pattern="^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$"
                                title="Only alphabetical characters allowed"
                                className="mb-0"
                            />
                        </div>

                        <hr style={{ border: 'none', borderTop: '1px solid var(--color-border)', margin: '2rem 0' }} />

                        <h4 style={{ marginBottom: '0.5rem', fontSize: '1.25rem' }}>{t('form.contactInfo')}</h4>
                        <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
                            {t('form.contactDesc')}
                        </p>
                        
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr auto', gap: '1rem', alignItems: 'end', marginBottom: '2rem' }}>
                            <div className="input-group mb-0" style={{ width: '100%' }}>
                                <label className="input-label">{t('form.type')}</label>
                                <Select 
                                    options={contactOptions}
                                    value={contactType}
                                    onChange={(option: any) => setContactType(option)}
                                    styles={selectStyles}
                                />
                            </div>
                            <div style={{ width: '100%' }}>
                                <Input 
                                    label={t('form.value')}
                                    type="text" 
                                    placeholder={t('form.enterContact')} 
                                    value={contactValue} 
                                    onChange={e => setContactValue(e.target.value)} 
                                    className="mb-0"
                                />
                            </div>
                            <div>
                                <Button type="button" variant="secondary" onClick={handleAddContact} style={{ height: '44px', marginBottom: '0' }}>{t('form.add')}</Button>
                            </div>
                        </div>

                        {contacts.length > 0 && (
                            <ul style={{ listStyleType: 'none', padding: 0, marginBottom: '2rem' }}>
                                {contacts.map((c, i) => (
                                    <li key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem 1rem', backgroundColor: 'var(--color-background)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', marginBottom: '0.75rem' }}>
                                        <span><strong style={{ color: 'var(--color-primary)' }}>{contactOptions.find(o => o.value === c.type)?.label || c.type}:</strong> {c.value}</span>
                                        <Button type="button" variant="outline" size="sm" onClick={() => handleRemoveContact(i)}>{t('form.remove')}</Button>
                                    </li>
                                ))}
                            </ul>
                        )}

                        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '3.5rem' }}>
                            <Button variant="primary" type="submit" isLoading={isSubmitting} disabled={isSubmitting} style={{ padding: '0.75rem 2rem' }}>
                                {isSubmitting ? t('form.submitting') : t('form.submit')}
                            </Button>
                        </div>
                    </form>
                </CardBody>
            </Card>
        </div>
    );
};

export default PersonRegistration;

import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardHeader, CardBody } from '../components/ui/Card';
import type { ApiResponse } from '../types/api';

interface PersonContact {
    type: string;
    value: string;
}

interface Person {
    id: number;
    documentId: string;
    firstName: string;
    lastName: string;
    birthDate: string;
    contacts: PersonContact[];
}

/**
 * PersonList Component
 * 
 * Displays a list of all registered persons retrieved from the backend API.
 * Includes their personal details and associated contact methods.
 * 
 * @returns {React.JSX.Element} The rendered Person List view.
 */
const PersonList: React.FC = () => {
    const { t } = useTranslation();
    const [persons, setPersons] = useState<Person[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchPersons = async () => {
            try {
                const response = await fetch('/api/persons');
                const result: ApiResponse<Person[]> = await response.json().catch(() => ({
                    success: false,
                    message: "Could not parse server response.",
                    errors: []
                }));

                if (response.ok && result.success && result.data) {
                    setPersons(result.data);
                } else {
                    setError(result.message || t('list.error'));
                }
            } catch (err: any) {
                setError(err.message || 'Connection error');
            } finally {
                setLoading(false);
            }
        };

        fetchPersons();
    }, [t]);

    return (
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
            <Card className="mb-4">
                <CardHeader>{t('list.title')}</CardHeader>
                <CardBody>
                    <p className="mb-4" style={{ color: 'var(--color-text-secondary)' }}>{t('list.description')}</p>

                    {error && (
                        <div style={{ backgroundColor: 'var(--color-error)', color: '#fff', padding: '1rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem' }}>
                            {error}
                        </div>
                    )}

                    {loading ? (
                        <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--color-text-secondary)' }}>
                            {t('list.loading')}
                        </div>
                    ) : persons.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--color-text-secondary)' }}>
                            {t('list.noPersons')}
                        </div>
                    ) : (
                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                                <thead>
                                    <tr style={{ borderBottom: '2px solid var(--color-border)', backgroundColor: 'var(--color-background)' }}>
                                        <th style={{ padding: '1rem' }}>{t('list.document')}</th>
                                        <th style={{ padding: '1rem' }}>{t('list.name')}</th>
                                        <th style={{ padding: '1rem' }}>{t('list.birthDate')}</th>
                                        <th style={{ padding: '1rem' }}>{t('list.contacts')}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {persons.map((person) => (
                                        <tr key={person.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                                            <td style={{ padding: '1rem', fontWeight: 600 }}>{person.documentId}</td>
                                            <td style={{ padding: '1rem' }}>{`${person.firstName} ${person.lastName}`}</td>
                                            <td style={{ padding: '1rem' }}>
                                                {new Date(person.birthDate).toLocaleDateString()}
                                            </td>
                                            <td style={{ padding: '1rem' }}>
                                                <ul style={{ listStyleType: 'none', padding: 0, margin: 0 }}>
                                                    {person.contacts.map((c, i) => (
                                                        <li key={i} style={{ marginBottom: '0.25rem', fontSize: '0.875rem' }}>
                                                            <span style={{ fontWeight: 600, color: 'var(--color-primary)' }}>{c.type}:</span> {c.value}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </CardBody>
            </Card>
        </div>
    );
};

export default PersonList;

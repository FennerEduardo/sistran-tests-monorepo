import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardHeader, CardBody } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

const QAResponses: React.FC = () => {
    const { t } = useTranslation();
    const [openSection, setOpenSection] = useState<number | null>(0);

    const toggleSection = (index: number) => {
        setOpenSection(openSection === index ? null : index);
    };

    const reactQuestions = t('qa.reactQuestions', { returnObjects: true }) as Array<{q: string, a: string}>;
    const dotnetQuestions = t('qa.dotnetQuestions', { returnObjects: true }) as Array<{q: string, a: string}>;

    return (
        <div className="container" style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '0.5rem', color: 'var(--color-text-primary)' }}>
                    {t('qa.title')}
                </h1>
                <p style={{ fontSize: '1.125rem', color: 'var(--color-text-secondary)' }}>
                    {t('qa.description')}
                </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                <Card>
                    <CardHeader style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }} onClick={() => toggleSection(0)}>
                        {t('qa.reactTestTitle')}
                        <Button variant="outline" size="sm">{openSection === 0 ? '-' : '+'}</Button>
                    </CardHeader>
                    {openSection === 0 && (
                        <CardBody>
                            <ul style={{ paddingLeft: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                {reactQuestions.map((item, index) => (
                                    <li key={index}>
                                        <strong>{item.q}</strong><br/>
                                        {item.a}
                                    </li>
                                ))}
                            </ul>
                        </CardBody>
                    )}
                </Card>

                <Card>
                    <CardHeader style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }} onClick={() => toggleSection(1)}>
                        {t('qa.dotnetTestTitle')}
                        <Button variant="outline" size="sm">{openSection === 1 ? '-' : '+'}</Button>
                    </CardHeader>
                    {openSection === 1 && (
                        <CardBody>
                            <ul style={{ paddingLeft: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                {dotnetQuestions.map((item, index) => (
                                    <li key={index}>
                                        <strong>{item.q}</strong><br/>
                                        {item.a}
                                    </li>
                                ))}
                            </ul>
                        </CardBody>
                    )}
                </Card>
            </div>
        </div>
    );
};

export default QAResponses;

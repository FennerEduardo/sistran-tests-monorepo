import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Card, CardHeader, CardBody } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { ShoppingCart, UserPlus, HelpCircle, Settings, Server, Monitor, Database, Globe, FileText, Code } from 'lucide-react';

/**
 * Home Component
 *
 * Landing page that describes the full solution architecture,
 * available features, and documentation resources.
 *
 * @returns {React.JSX.Element} The Home page.
 */
const Home: React.FC = () => {
    const { t } = useTranslation();

    const features = [
        { icon: <ShoppingCart size={28} />, path: '/ecommerce', title: t('home.featureEcommerce'), desc: t('home.featureEcommerceDesc') },
        { icon: <UserPlus size={28} />, path: '/registration', title: t('home.featureRegistration'), desc: t('home.featureRegistrationDesc') },
        { icon: <HelpCircle size={28} />, path: '/qa', title: t('home.featureQA'), desc: t('home.featureQADesc') },
        { icon: <Settings size={28} />, path: '/admin', title: t('home.featureAdmin'), desc: t('home.featureAdminDesc') },
    ];

    const techStack = [
        { icon: <Server size={20} />, label: '.NET 10', detail: 'ASP.NET Core Web API + EF Core + SQL Server' },
        { icon: <Monitor size={20} />, label: 'React 19 + TypeScript', detail: 'Vite, React Router, react-i18next' },
        { icon: <Database size={20} />, label: 'SQL Server 2022', detail: 'Docker container, EF Core Code-First' },
        { icon: <Globe size={20} />, label: 'i18n', detail: 'Accept-Language header + react-i18next (EN/ES)' },
        { icon: <Code size={20} />, label: 'Docker Compose', detail: 'Multi-service orchestration (Frontend, Backend, DB)' },
        { icon: <FileText size={20} />, label: 'Swagger / OpenAPI', detail: 'Auto-generated API documentation at /swagger' },
    ];

    const docs = [
        { title: t('home.docSwagger'), desc: t('home.docSwaggerDesc'), url: 'http://localhost:5000/swagger' },
        { title: t('home.docGherkin'), desc: t('home.docGherkinDesc'), url: null },
    ];

    return (
        <div>
            {/* Hero Section */}
            <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', marginBottom: '1rem' }}>
                    <img src="https://fennereduardo.com/favicon.svg" alt="Logo" style={{ width: '48px', height: '48px' }} />
                    <h1 style={{ margin: 0, fontSize: '2rem' }}>
                        SISTRAN<span style={{ color: 'var(--color-accent)' }}>.</span> {t('home.heroTitle')}
                    </h1>
                </div>
                <p style={{ color: 'var(--color-text-secondary)', maxWidth: '700px', margin: '0 auto', lineHeight: 1.7 }}>
                    {t('home.heroSubtitle')}
                </p>
            </div>

            {/* Features Grid */}
            <h2 style={{ marginBottom: '1.5rem' }}>{t('home.featuresTitle')}</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
                {features.map((f, i) => (
                    <Link to={f.path} key={i} style={{ textDecoration: 'none', color: 'inherit' }}>
                        <Card style={{ height: '100%', cursor: 'pointer', transition: 'transform 0.2s ease, box-shadow 0.2s ease' }}>
                            <CardBody>
                                <div style={{ color: 'var(--color-primary)', marginBottom: '1rem' }}>{f.icon}</div>
                                <h4 style={{ marginBottom: '0.5rem' }}>{f.title}</h4>
                                <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem', margin: 0 }}>{f.desc}</p>
                            </CardBody>
                        </Card>
                    </Link>
                ))}
            </div>

            {/* Architecture Section */}
            <h2 style={{ marginBottom: '1.5rem' }}>{t('home.archTitle')}</h2>
            <Card style={{ marginBottom: '3rem' }}>
                <CardBody>
                    <p style={{ color: 'var(--color-text-secondary)', marginBottom: '1.5rem', lineHeight: 1.7 }}>
                        {t('home.archDesc')}
                    </p>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
                        {techStack.map((tech, i) => (
                            <div key={i} style={{
                                display: 'flex', alignItems: 'flex-start', gap: '0.75rem',
                                padding: '1rem', backgroundColor: 'var(--color-background)',
                                borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)'
                            }}>
                                <div style={{ color: 'var(--color-primary)', flexShrink: 0, marginTop: '2px' }}>{tech.icon}</div>
                                <div>
                                    <strong style={{ display: 'block', marginBottom: '0.25rem' }}>{tech.label}</strong>
                                    <span style={{ color: 'var(--color-text-secondary)', fontSize: '0.8rem' }}>{tech.detail}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardBody>
            </Card>

            {/* Documentation Section */}
            <h2 style={{ marginBottom: '1.5rem' }}>{t('home.docsTitle')}</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
                {docs.map((doc, i) => (
                    <Card key={i}>
                        <CardBody>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                                <FileText size={20} style={{ color: 'var(--color-primary)' }} />
                                <h4 style={{ margin: 0 }}>{doc.title}</h4>
                            </div>
                            <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem', marginBottom: '1rem' }}>{doc.desc}</p>
                            {doc.url && (
                                <a href={doc.url} target="_blank" rel="noopener noreferrer">
                                    <Button variant="outline" size="sm">{t('home.viewDocs')}</Button>
                                </a>
                            )}
                        </CardBody>
                    </Card>
                ))}
            </div>

            {/* Quick Start */}
            <Card style={{ marginBottom: '2rem' }}>
                <CardHeader>{t('home.quickStartTitle')}</CardHeader>
                <CardBody>
                    <pre style={{
                        backgroundColor: 'var(--color-background)', padding: '1.5rem',
                        borderRadius: 'var(--radius-md)', overflow: 'auto',
                        border: '1px solid var(--color-border)', fontSize: '0.85rem',
                        lineHeight: 1.8
                    }}>
{`# Clone and start
git clone <repository-url>
cd sistran-tests-monorepo

# Start all services
docker-compose up -d --build

# Access the application
Frontend:  http://localhost
Backend:   http://localhost:5000
Swagger:   http://localhost:5000/swagger`}
                    </pre>
                </CardBody>
            </Card>
        </div>
    );
};

export default Home;

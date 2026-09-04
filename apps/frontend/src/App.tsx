import React from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Moon, Sun, Globe } from 'lucide-react';
import { useTheme } from './context/ThemeContext';
import { Button } from './components/ui/Button';

import Ecommerce from './pages/Ecommerce';
import PersonRegistration from './pages/PersonRegistration';
import QAResponses from './pages/QAResponses';

/**
 * Main Application Component
 * 
 * Sets up the routing and main layout for the SISTRAN Monorepo Frontend.
 * Includes a custom navigation bar with theme and language toggles.
 * 
 * @returns {React.JSX.Element} The root application component.
 */
function App() {
  const { t, i18n } = useTranslation();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'es' : 'en';
    i18n.changeLanguage(newLang);
    localStorage.setItem('language', newLang);
  };

  const navLinks = [
    { path: '/ecommerce', label: t('nav.ecommerce') },
    { path: '/registration', label: t('nav.register') },
    { path: '/qa', label: t('nav.qa') },
  ];

  return (
    <>
      <header style={{ backgroundColor: 'var(--color-surface)', borderBottom: '1px solid var(--color-border)', padding: '1rem 0' }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
            <Link to="/" style={{ fontWeight: 800, fontSize: '1.25rem', color: 'var(--color-primary)' }}>
              SISTRAN<span style={{ color: 'var(--color-accent)' }}>.</span>
            </Link>
            <nav style={{ display: 'flex', gap: '1rem' }}>
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  style={{
                    color: location.pathname.startsWith(link.path) ? 'var(--color-primary)' : 'var(--color-text-secondary)',
                    fontWeight: location.pathname.startsWith(link.path) ? 600 : 400,
                    textDecoration: 'none'
                  }}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Button variant="outline" size="sm" onClick={toggleLanguage} aria-label="Toggle Language" title="Toggle Language">
              <Globe size={18} />
              <span style={{ textTransform: 'uppercase', fontSize: '0.75rem' }}>{i18n.language}</span>
            </Button>
            <Button variant="outline" size="sm" onClick={toggleTheme} aria-label="Toggle Theme" title="Toggle Theme">
              {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
            </Button>
          </div>
        </div>
      </header>

      <main className="container mt-8">
        <Routes>
          <Route path="/" element={<h2 className="text-center">{t('nav.qa')} & {t('nav.ecommerce')} Portal</h2>} />
          <Route path="/ecommerce/*" element={<Ecommerce />} />
          <Route path="/registration" element={<PersonRegistration />} />
          <Route path="/qa" element={<QAResponses />} />
        </Routes>
      </main>
    </>
  );
}

export default App;

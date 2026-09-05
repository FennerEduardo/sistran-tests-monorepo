import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Moon, Sun, Globe } from 'lucide-react';
import { useTheme } from './context/ThemeContext';
import { Button } from './components/ui/Button';

import Ecommerce from './pages/Ecommerce';
import PersonRegistration from './pages/PersonRegistration';
import PersonList from './pages/PersonList';
import QAResponses from './pages/QAResponses';
import Admin from './pages/Admin';
import Home from './pages/Home';

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
    { path: '/persons', label: t('nav.persons') },
    { path: '/qa', label: t('nav.qa') },
    { path: '/admin', label: t('nav.admin') },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <header style={{ backgroundColor: 'var(--color-surface)', borderBottom: '1px solid var(--color-border)', padding: '1rem 0' }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', flexWrap: 'wrap' }}>
            <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}>
              <img src="https://fennereduardo.com/favicon.svg" alt="Fenner Eduardo Logo" style={{ width: '28px', height: '28px' }} />
              <div style={{ fontWeight: 800, fontSize: '1.25rem', color: 'var(--color-primary)' }}>
                SISTRAN<span style={{ color: 'var(--color-accent)' }}>.</span>
              </div>
            </Link>
            <nav style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
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

      <main className="container" style={{ marginTop: '2rem', flexGrow: 1 }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/ecommerce/*" element={<Ecommerce />} />
          <Route path="/registration" element={<PersonRegistration />} />
          <Route path="/persons" element={<PersonList />} />
          <Route path="/qa" element={<QAResponses />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </main>

      <footer style={{ backgroundColor: 'var(--color-surface)', borderTop: '1px solid var(--color-border)', padding: '2rem 0', marginTop: '3rem', textAlign: 'center' }}>
        <div className="container">
          <p style={{ color: 'var(--color-text-secondary)', marginBottom: '0.5rem' }}>
            &copy; {new Date().getFullYear()} SISTRAN Technical Test. All rights reserved.
          </p>
          <p style={{ fontSize: '0.875rem' }}>
            Designed & Developed by{' '}
            <a href="https://fennereduardo.com" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-primary)', fontWeight: 600, textDecoration: 'none' }}>
              Fenner Eduardo
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;

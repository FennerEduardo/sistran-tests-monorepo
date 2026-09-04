import { Routes, Route, Link } from 'react-router-dom';
import { Navbar, Container, Nav } from 'react-bootstrap';
import Ecommerce from './pages/Ecommerce';
import PersonRegistration from './pages/PersonRegistration';
import QAResponses from './pages/QAResponses';

/**
 * Main Application Component
 * 
 * Sets up the routing and main layout for the SISTRAN Monorepo Frontend.
 * Includes a navigation bar and the main content container.
 * 
 * @returns {React.JSX.Element} The root application component.
 */
function App() {
  return (
    <>
      <Navbar bg="dark" variant="dark" expand="lg">
        <Container>
          <Navbar.Brand as={Link} to="/">SISTRAN Tests</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link as={Link} to="/ecommerce">E-commerce</Nav.Link>
              <Nav.Link as={Link} to="/registration">Person Registration</Nav.Link>
              <Nav.Link as={Link} to="/qa">Test Responses</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Container className="mt-4">
        <Routes>
          <Route path="/" element={<h2>Welcome to SISTRAN Tests Monorepo</h2>} />
          <Route path="/ecommerce/*" element={<Ecommerce />} />
          <Route path="/registration" element={<PersonRegistration />} />
          <Route path="/qa" element={<QAResponses />} />
        </Routes>
      </Container>
    </>
  )
}

export default App

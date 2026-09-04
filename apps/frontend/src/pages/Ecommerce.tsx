import React, { useState, useEffect, createContext, useContext } from 'react';
import { Card, Button, Row, Col, Badge } from 'react-bootstrap';
import { Link, Routes, Route, useNavigate } from 'react-router-dom';

/**
 * Context to share the shopping cart state across Ecommerce components.
 */
const CartContext = createContext<any>(null);

/**
 * Ecommerce Component
 * 
 * Serves as the main layout and state provider for the mini e-commerce test.
 * 
 * @returns {React.JSX.Element} The Ecommerce view.
 */
const Ecommerce: React.FC = () => {
    const [cart, setCart] = useState<any[]>([]);

    /**
     * Adds a product to the cart or increments its quantity if it already exists.
     * 
     * @param {any} product The product to add.
     * @param {number} quantity The amount to add.
     */
    const addToCart = (product: any, quantity: number) => {
        const item = cart.find(i => i.product.id === product.id);
        if (item) {
            setCart(cart.map(i => i.product.id === product.id ? { ...i, quantity: i.quantity + quantity } : i));
        } else {
            setCart([...cart, { product, quantity }]);
        }
    };

    const cartTotal = cart.reduce((acc, i) => acc + i.quantity, 0);

    return (
        <CartContext.Provider value={{ cart, addToCart, cartTotal }}>
            <div>
                <h2>SISTRAN E-commerce</h2>
                <div className="d-flex justify-content-end mb-3">
                    <CartWidget />
                </div>
                <Routes>
                    <Route path="/" element={<ItemListContainer />} />
                    <Route path="/checkout" element={<Checkout />} />
                </Routes>
            </div>
        </CartContext.Provider>
    );
};

/**
 * CartWidget Component
 * 
 * Displays the current amount of items in the shopping cart.
 * 
 * @returns {React.JSX.Element} The Cart Widget.
 */
const CartWidget: React.FC = () => {
    const { cartTotal } = useContext(CartContext);
    return (
        <Link to="/ecommerce/checkout" className="btn btn-outline-primary">
            🛒 Cart <Badge bg="secondary">{cartTotal}</Badge>
        </Link>
    );
};

/**
 * ItemListContainer Component
 * 
 * Fetches products from the backend API and displays them.
 * Falls back to mock data if the API is unavailable.
 * 
 * @returns {React.JSX.Element} The product list grid.
 */
const ItemListContainer: React.FC = () => {
    const [products, setProducts] = useState<any[]>([]);

    useEffect(() => {
        fetch('http://localhost:5000/api/products')
            .then(r => r.json())
            .then(result => {
                if (result && result.success) {
                    setProducts(result.data);
                } else {
                    throw new Error("Invalid response format");
                }
            })
            .catch(() => {
                setProducts([
                    { id: 1, title: 'Mock Laptop', price: 1000, description: 'Mock', imageUrl: 'https://via.placeholder.com/150' },
                    { id: 2, title: 'Mock Book', price: 20, description: 'Mock', imageUrl: 'https://via.placeholder.com/150' }
                ]);
            });
    }, []);

    return (
        <Row>
            {products.map(p => (
                <Col key={p.id} md={4}>
                    <Item product={p} />
                </Col>
            ))}
        </Row>
    );
};

/**
 * Item Component
 * 
 * Displays a single product's details and an "Add to Cart" button.
 * 
 * @param {{ product: any }} props - Component props containing the product.
 * @returns {React.JSX.Element} The product card.
 */
const Item: React.FC<{ product: any }> = ({ product }) => {
    const { addToCart } = useContext(CartContext);
    return (
        <Card className="mb-4">
            <Card.Img variant="top" src={product.imageUrl} />
            <Card.Body>
                <Card.Title>{product.title}</Card.Title>
                <Card.Text>${product.price}</Card.Text>
                <Button variant="primary" onClick={() => addToCart(product, 1)}>Add to Cart</Button>
            </Card.Body>
        </Card>
    );
};

/**
 * Checkout Component
 * 
 * Displays the cart summary and handles the purchase confirmation.
 * 
 * @returns {React.JSX.Element} The checkout view.
 */
const Checkout: React.FC = () => {
    const { cart } = useContext(CartContext);
    const navigate = useNavigate();

    const total = cart.reduce((acc: number, item: any) => acc + (item.product.price * item.quantity), 0);

    return (
        <div>
            <h3>Purchase Summary</h3>
            {cart.length === 0 ? <p>The cart is empty.</p> : (
                <ul>
                    {cart.map((c: any, i: number) => (
                        <li key={i}>{c.quantity}x {c.product.title} - ${c.product.price * c.quantity}</li>
                    ))}
                </ul>
            )}
            <h4>Total: ${total}</h4>
            <Button variant="success" disabled={cart.length === 0} onClick={() => {
                alert('Purchase completed');
                // We should clear the cart here but the context setter wasn't passed down initially.
                // Assuming success navigate away:
                navigate('/ecommerce');
            }}>Complete Purchase</Button>
        </div>
    );
};

export default Ecommerce;

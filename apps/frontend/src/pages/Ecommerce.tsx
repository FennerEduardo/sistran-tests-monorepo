import React, { useState, useEffect, createContext, useContext } from 'react';
import { Card, Button, Row, Col, Badge } from 'react-bootstrap';
import { Link, Routes, Route, useNavigate } from 'react-router-dom';

// Contexto
const CartContext = createContext<any>(null);

const Ecommerce: React.FC = () => {
    const [cart, setCart] = useState<any[]>([]);

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
                <h2>E-commerce SISTRAN</h2>
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

const CartWidget: React.FC = () => {
    const { cartTotal } = useContext(CartContext);
    return (
        <Link to="/ecommerce/checkout" className="btn btn-outline-primary">
            🛒 Carrito <Badge bg="secondary">{cartTotal}</Badge>
        </Link>
    );
};

const ItemListContainer: React.FC = () => {
    const [products, setProducts] = useState<any[]>([]);

    useEffect(() => {
        // En producción esto iría al backend, pero mockearemos si falla
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

const Item: React.FC<{ product: any }> = ({ product }) => {
    const { addToCart } = useContext(CartContext);
    return (
        <Card className="mb-4">
            <Card.Img variant="top" src={product.imageUrl} />
            <Card.Body>
                <Card.Title>{product.title}</Card.Title>
                <Card.Text>${product.price}</Card.Text>
                <Button variant="primary" onClick={() => addToCart(product, 1)}>Agregar al Carrito</Button>
            </Card.Body>
        </Card>
    );
};

const Checkout: React.FC = () => {
    const { cart } = useContext(CartContext);
    const navigate = useNavigate();

    const total = cart.reduce((acc: number, item: any) => acc + (item.product.price * item.quantity), 0);

    return (
        <div>
            <h3>Resumen de Compra</h3>
            {cart.length === 0 ? <p>El carrito está vacío.</p> : (
                <ul>
                    {cart.map((c: any, i: number) => (
                        <li key={i}>{c.quantity}x {c.product.title} - ${c.product.price * c.quantity}</li>
                    ))}
                </ul>
            )}
            <h4>Total: ${total}</h4>
            <Button variant="success" disabled={cart.length === 0} onClick={() => {
                alert('Compra finalizada');
                navigate('/ecommerce');
            }}>Finalizar Compra</Button>
        </div>
    );
};

export default Ecommerce;

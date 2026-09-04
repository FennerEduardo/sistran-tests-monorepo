import React, { useState, useEffect, createContext, useContext } from 'react';
import { Link, Routes, Route, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Card, CardHeader, CardBody, CardFooter } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

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
    const { t } = useTranslation();
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
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                    <h2>{t('ecommerce.title')}</h2>
                    <CartWidget />
                </div>
                <p style={{ color: 'var(--color-text-secondary)', marginBottom: '2rem' }}>{t('ecommerce.description')}</p>
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
        <Link to="/ecommerce/checkout" style={{ textDecoration: 'none' }}>
            <Button variant="outline">
                🛒 Cart
                <span style={{ 
                    backgroundColor: 'var(--color-primary)', 
                    color: '#fff', 
                    borderRadius: '10px', 
                    padding: '0.1rem 0.5rem', 
                    fontSize: '0.75rem',
                    marginLeft: '0.5rem'
                }}>
                    {cartTotal}
                </span>
            </Button>
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
    const { t, i18n } = useTranslation();
    const [products, setProducts] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setIsLoading(true);
        fetch('http://localhost:5000/api/products', {
            headers: {
                'Accept-Language': i18n.language
            }
        })
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
                    { id: 1, title: 'Mock Laptop', price: 1000, description: 'High performance laptop', imageUrl: 'https://fakestoreapi.com/img/81QpkIctqPL._AC_SX679_.jpg' },
                    { id: 2, title: 'Mock Book', price: 20, description: 'Interesting read', imageUrl: 'https://fakestoreapi.com/img/71pWzhdJNwL._AC_UL640_QL65_ML3_.jpg' },
                    { id: 3, title: 'Mock Headphones', price: 150, description: 'Noise cancelling', imageUrl: 'https://fakestoreapi.com/img/61IBBVJvSDL._AC_SY879_.jpg' }
                ]);
            })
            .finally(() => setIsLoading(false));
    }, [i18n.language]);

    if (isLoading) {
        return <p>{t('ecommerce.loading')}</p>;
    }

    return (
        <div>
            <h3 style={{ marginBottom: '1.5rem' }}>{t('ecommerce.featuredProducts')}</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1.5rem' }}>
                {products.map(p => (
                    <Item key={p.id} product={p} />
                ))}
            </div>
        </div>
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
    const { t } = useTranslation();
    const { addToCart } = useContext(CartContext);
    return (
        <Card style={{ height: '100%' }}>
            <div style={{ 
                height: '150px', 
                backgroundColor: 'var(--color-surface)',
                backgroundImage: `url(${product.imageUrl})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                borderBottom: '1px solid var(--color-border)'
            }} />
            <CardBody style={{ display: 'flex', flexDirection: 'column' }}>
                <h4 style={{ fontSize: '1.125rem', marginBottom: '0.5rem' }}>{product.title}</h4>
                <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem', flexGrow: 1 }}>{product.description}</p>
                <div style={{ marginTop: '1rem', fontWeight: 600, fontSize: '1.25rem', color: 'var(--color-primary)' }}>
                    {t('ecommerce.price')}{product.price}
                </div>
            </CardBody>
            <CardFooter>
                <Button variant="primary" style={{ width: '100%' }} onClick={() => addToCart(product, 1)}>
                    {t('ecommerce.addToCart')}
                </Button>
            </CardFooter>
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
        <Card>
            <CardHeader>Purchase Summary</CardHeader>
            <CardBody>
                {cart.length === 0 ? <p>The cart is empty.</p> : (
                    <ul style={{ listStyleType: 'none', padding: 0 }}>
                        {cart.map((c: any, i: number) => (
                            <li key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem 0', borderBottom: '1px solid var(--color-border)' }}>
                                <span>{c.quantity}x {c.product.title}</span>
                                <strong>${c.product.price * c.quantity}</strong>
                            </li>
                        ))}
                    </ul>
                )}
                <h3 style={{ marginTop: '1.5rem', textAlign: 'right' }}>Total: ${total}</h3>
            </CardBody>
            <CardFooter>
                <Button variant="success" style={{ marginLeft: 'auto' }} disabled={cart.length === 0} onClick={() => {
                    alert('Purchase completed');
                    // In a real app we'd clear the cart via Context here
                    navigate('/ecommerce');
                }}>
                    Complete Purchase
                </Button>
            </CardFooter>
        </Card>
    );
};

export default Ecommerce;

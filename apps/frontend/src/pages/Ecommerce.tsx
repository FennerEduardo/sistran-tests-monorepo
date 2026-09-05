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

    const removeFromCart = (productId: number) => {
        setCart(cart.filter(i => i.product.id !== productId));
    };

    const clearCart = () => {
        setCart([]);
    };

    const cartTotal = cart.reduce((acc, i) => acc + i.quantity, 0);

    return (
        <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart, cartTotal }}>
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
        fetch('/api/products', {
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
                borderBottom: '1px solid var(--color-border)',
                position: 'relative'
            }}>
                {product.category && (
                    <span style={{
                        position: 'absolute',
                        top: '0.5rem',
                        right: '0.5rem',
                        backgroundColor: 'var(--color-primary)',
                        color: '#fff',
                        padding: '0.15rem 0.5rem',
                        borderRadius: '999px',
                        fontSize: '0.7rem',
                        fontWeight: 600
                    }}>
                        {product.category.name}
                    </span>
                )}
            </div>
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
 * Allows optionally selecting a registered Person to link the order.
 * 
 * @returns {React.JSX.Element} The checkout view.
 */
const Checkout: React.FC = () => {
    const { t, i18n } = useTranslation();
    const { cart, removeFromCart, clearCart } = useContext(CartContext);
    const navigate = useNavigate();

    const [persons, setPersons] = useState<any[]>([]);
    const [selectedPersonId, setSelectedPersonId] = useState<string>('');
    
    const [buyerForm, setBuyerForm] = useState({
        name: '',
        document: '',
        email: '',
        phone: ''
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showInvoice, setShowInvoice] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const total = cart.reduce((acc: number, item: any) => acc + (item.product.price * item.quantity), 0);
    const tax = total * 0.19; // Simulate 19% VAT

    useEffect(() => {
        // Fetch registered persons
        fetch('/api/persons', { headers: { 'Accept-Language': i18n.language } })
            .then(res => res.json())
            .then(result => {
                if (result.success && result.data) {
                    setPersons(result.data);
                }
            })
            .catch(() => { });
    }, [i18n.language]);

    const handlePersonChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const id = e.target.value;
        setSelectedPersonId(id);
        
        if (id) {
            const p = persons.find(person => person.id.toString() === id);
            if (p) {
                const emailContact = p.contacts?.find((c: any) => c.type === 'Email');
                const phoneContact = p.contacts?.find((c: any) => c.type === 'Phone');
                setBuyerForm({
                    name: `${p.firstName} ${p.lastName}`,
                    document: p.documentId,
                    email: emailContact ? emailContact.value : '',
                    phone: phoneContact ? phoneContact.value : ''
                });
            }
        } else {
            setBuyerForm({ name: '', document: '', email: '', phone: '' });
        }
    };

    const handleCheckout = async () => {
        if (cart.length === 0) return;
        setIsSubmitting(true);
        setError(null);

        const payload = {
            total: total,
            buyerName: buyerForm.name,
            buyerDocument: buyerForm.document,
            buyerEmail: buyerForm.email,
            buyerPhone: buyerForm.phone,
            personId: selectedPersonId ? parseInt(selectedPersonId) : null,
            items: cart.map((c: any) => ({
                productId: c.product.id,
                quantity: c.quantity,
                unitPrice: c.product.price
            }))
        };

        try {
            const res = await fetch('/api/orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            const result = await res.json();
            
            if (res.ok && result.success) {
                setShowInvoice(true);
            } else {
                setError(result.message || 'Error processing order.');
            }
        } catch (err: any) {
            setError('Connection error processing order.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const closeInvoice = () => {
        setShowInvoice(false);
        clearCart();
        navigate('/ecommerce');
    };

    if (showInvoice) {
        return (
            <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
                <div style={{ backgroundColor: 'var(--color-surface)', padding: '2.5rem', borderRadius: '12px', maxWidth: '500px', width: '90%', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)' }}>
                    <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                        <div style={{ backgroundColor: 'var(--color-success)', color: '#fff', width: '64px', height: '64px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', fontSize: '2rem' }}>✓</div>
                        <h2 style={{ margin: 0, color: 'var(--color-text-primary)' }}>Factura de Venta</h2>
                        <p style={{ color: 'var(--color-success)', fontWeight: 600, marginTop: '0.5rem' }}>¡Su envío llegará pronto!</p>
                    </div>
                    
                    <div style={{ borderTop: '1px dashed var(--color-border)', borderBottom: '1px dashed var(--color-border)', padding: '1.5rem 0', margin: '1.5rem 0' }}>
                        <p><strong>Comprador:</strong> {buyerForm.name || 'Invitado'}</p>
                        {buyerForm.document && <p><strong>Documento:</strong> {buyerForm.document}</p>}
                        {buyerForm.email && <p><strong>Email:</strong> {buyerForm.email}</p>}
                        
                        <div style={{ marginTop: '1rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span>Subtotal:</span>
                                <span>${(total - tax).toFixed(2)}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-text-secondary)' }}>
                                <span>Impuestos (19%):</span>
                                <span>${tax.toFixed(2)}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: '1.25rem', marginTop: '0.5rem', paddingTop: '0.5rem', borderTop: '1px solid var(--color-border)' }}>
                                <span>Total:</span>
                                <span>${total.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>
                    
                    <Button variant="primary" style={{ width: '100%' }} onClick={closeInvoice}>
                        Finalizar y Volver
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', alignItems: 'flex-start' }}>
            <div style={{ flex: '1 1 400px' }}>
                <Card>
                    <CardHeader>Información de Compra</CardHeader>
                    <CardBody>
                        <div className="input-group">
                            <label className="input-label">Vincular con Persona Registrada (Opcional)</label>
                            <select 
                                className="input-control" 
                                value={selectedPersonId}
                                onChange={handlePersonChange}
                                style={{ width: '100%' }}
                            >
                                <option value="">-- Comprar como Invitado --</option>
                                {persons.map(p => (
                                    <option key={p.id} value={p.id}>{p.firstName} {p.lastName} - {p.documentId}</option>
                                ))}
                            </select>
                            <span style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)', marginTop: '0.5rem', display: 'block' }}>
                                Al seleccionar una persona, el pedido quedará enlazado en la base de datos a su ID.
                            </span>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1.5rem' }}>
                            <div className="input-group mb-0">
                                <label className="input-label">Nombre Completo</label>
                                <input className="input-control" value={buyerForm.name} onChange={e => setBuyerForm({...buyerForm, name: e.target.value})} />
                            </div>
                            <div className="input-group mb-0">
                                <label className="input-label">Documento</label>
                                <input className="input-control" value={buyerForm.document} onChange={e => setBuyerForm({...buyerForm, document: e.target.value})} />
                            </div>
                            <div className="input-group mb-0">
                                <label className="input-label">Correo Electrónico</label>
                                <input className="input-control" value={buyerForm.email} onChange={e => setBuyerForm({...buyerForm, email: e.target.value})} />
                            </div>
                            <div className="input-group mb-0">
                                <label className="input-label">Teléfono</label>
                                <input className="input-control" value={buyerForm.phone} onChange={e => setBuyerForm({...buyerForm, phone: e.target.value})} />
                            </div>
                        </div>
                        
                        {error && <div style={{ color: 'var(--color-error)', marginTop: '1rem', fontSize: '0.875rem' }}>{error}</div>}
                    </CardBody>
                </Card>
            </div>

            <div style={{ flex: '1 1 350px' }}>
                <Card>
                    <CardHeader>Resumen del Pedido</CardHeader>
                    <CardBody>
                        {cart.length === 0 ? <p>El carrito está vacío.</p> : (
                            <ul style={{ listStyleType: 'none', padding: 0 }}>
                                {cart.map((c: any, i: number) => (
                                    <li key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem 0', borderBottom: '1px solid var(--color-border)' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            <button 
                                                onClick={() => removeFromCart(c.product.id)}
                                                style={{ background: 'none', border: 'none', color: 'var(--color-error)', cursor: 'pointer', fontSize: '1rem', padding: '0 0.5rem' }}
                                                title="Eliminar del carrito"
                                            >
                                                ✕
                                            </button>
                                            <span>{c.quantity}x {c.product.title}</span>
                                        </div>
                                        <strong>${(c.product.price * c.quantity).toFixed(2)}</strong>
                                    </li>
                                ))}
                            </ul>
                        )}
                        <h3 style={{ marginTop: '1.5rem', textAlign: 'right', fontSize: '1.5rem' }}>Total: ${total.toFixed(2)}</h3>
                    </CardBody>
                    <CardFooter>
                        <Button 
                            variant="success" 
                            style={{ width: '100%' }} 
                            disabled={cart.length === 0 || isSubmitting} 
                            onClick={handleCheckout}
                        >
                            {isSubmitting ? 'Procesando...' : 'Confirmar y Pagar'}
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
};

export default Ecommerce;

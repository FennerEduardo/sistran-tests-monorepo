import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardHeader, CardBody } from '../components/ui/Card';
import { ShoppingBag, User } from 'lucide-react';

/**
 * OrderList Component
 * 
 * Independent view to display all e-commerce orders.
 * Shows buyer information and links to registered persons if applicable.
 */
const OrderList: React.FC = () => {
    const { t, i18n } = useTranslation();
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/orders', { headers: { 'Accept-Language': i18n.language } })
            .then(res => res.json())
            .then(result => {
                if (result.success && result.data) {
                    // Sort orders by newest first
                    setOrders(result.data.sort((a: any, b: any) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime()));
                }
            })
            .catch(() => { })
            .finally(() => setLoading(false));
    }, [i18n.language]);

    if (loading) {
        return <p>Cargando pedidos...</p>;
    }

    return (
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '0.5rem', color: 'var(--color-text-primary)' }}>
                    Historial de Pedidos
                </h1>
                <p style={{ fontSize: '1.125rem', color: 'var(--color-text-secondary)' }}>
                    Visualiza y haz seguimiento de todas las compras realizadas en el sistema.
                </p>
            </div>

            {orders.length === 0 ? (
                <Card>
                    <CardBody style={{ textAlign: 'center', padding: '3rem' }}>
                        <ShoppingBag size={48} style={{ color: 'var(--color-text-disabled)', margin: '0 auto 1rem' }} />
                        <h3>No hay pedidos registrados</h3>
                        <p style={{ color: 'var(--color-text-secondary)' }}>Los pedidos aparecerán aquí una vez que los usuarios realicen compras en el e-commerce.</p>
                    </CardBody>
                </Card>
            ) : (
                <div style={{ display: 'grid', gap: '1.5rem' }}>
                    {orders.map((order) => (
                        <Card key={order.id}>
                            <CardHeader style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 1.5rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <ShoppingBag size={20} />
                                    <span>Pedido #{order.id}</span>
                                </div>
                                <span style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
                                    {new Date(order.orderDate).toLocaleString()}
                                </span>
                            </CardHeader>
                            <CardBody style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem' }}>
                                <div style={{ flex: '1 1 300px' }}>
                                    <h4 style={{ marginBottom: '1rem', color: 'var(--color-text-secondary)', fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                        Información del Comprador
                                    </h4>
                                    
                                    {order.person ? (
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem', padding: '0.75rem', backgroundColor: 'var(--color-background)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-primary)' }}>
                                            <div style={{ backgroundColor: 'var(--color-primary)', color: '#fff', padding: '0.5rem', borderRadius: '50%' }}>
                                                <User size={20} />
                                            </div>
                                            <div>
                                                <p style={{ margin: 0, fontWeight: 600 }}>Usuario Registrado</p>
                                                <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
                                                    {order.person.firstName} {order.person.lastName} ({order.person.documentId})
                                                </p>
                                            </div>
                                        </div>
                                    ) : (
                                        <p style={{ fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: '1rem' }}>Compra como Invitado</p>
                                    )}

                                    <ul style={{ listStyleType: 'none', padding: 0, margin: 0, fontSize: '0.875rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                        <li><strong>Nombre:</strong> {order.buyerName || '-'}</li>
                                        <li><strong>Documento:</strong> {order.buyerDocument || '-'}</li>
                                        <li><strong>Email:</strong> {order.buyerEmail || '-'}</li>
                                        <li><strong>Teléfono:</strong> {order.buyerPhone || '-'}</li>
                                    </ul>
                                </div>
                                
                                <div style={{ flex: '2 1 400px' }}>
                                    <h4 style={{ marginBottom: '1rem', color: 'var(--color-text-secondary)', fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                        Resumen de Artículos
                                    </h4>
                                    <ul style={{ listStyleType: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                        {order.items.map((item: any) => (
                                            <li key={item.id} style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.75rem', borderBottom: '1px dashed var(--color-border)' }}>
                                                <div style={{ display: 'flex', gap: '1rem' }}>
                                                    <span style={{ fontWeight: 600 }}>{item.quantity}x</span>
                                                    <span>{item.product?.title || 'Producto Eliminado'}</span>
                                                </div>
                                                <span>${(item.unitPrice * item.quantity).toFixed(2)}</span>
                                            </li>
                                        ))}
                                    </ul>
                                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem', paddingTop: '1rem', borderTop: '2px solid var(--color-border)' }}>
                                        <div style={{ textAlign: 'right' }}>
                                            <span style={{ color: 'var(--color-text-secondary)', marginRight: '1rem' }}>Total Pago:</span>
                                            <span style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-primary)' }}>${order.total.toFixed(2)}</span>
                                        </div>
                                    </div>
                                </div>
                            </CardBody>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
};

export default OrderList;

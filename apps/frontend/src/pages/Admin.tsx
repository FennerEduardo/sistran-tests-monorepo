import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardHeader, CardBody } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Pencil, Trash2, Plus, Search, Image as ImageIcon } from 'lucide-react';

const API_BASE = '/api';

/**
 * Admin Panel Component
 *
 * Provides full CRUD management for Categories and Products.
 * Integrates with the backend proxy for Pexels product image search.
 *
 * @returns {React.JSX.Element} The Admin panel page.
 */
const Admin: React.FC = () => {
    const { t, i18n } = useTranslation();
    const [activeTab, setActiveTab] = useState<'categories' | 'products'>('categories');

    return (
        <div>
            <h2 style={{ marginBottom: '0.5rem' }}>{t('admin.title')}</h2>
            <p style={{ color: 'var(--color-text-secondary)', marginBottom: '2rem' }}>{t('admin.description')}</p>

            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
                <Button
                    variant={activeTab === 'categories' ? 'primary' : 'outline'}
                    onClick={() => setActiveTab('categories')}
                >
                    {t('admin.categories')}
                </Button>
                <Button
                    variant={activeTab === 'products' ? 'primary' : 'outline'}
                    onClick={() => setActiveTab('products')}
                >
                    {t('admin.products')}
                </Button>
            </div>

            {activeTab === 'categories' ? <CategoriesCrud /> : <ProductsCrud />}
        </div>
    );
};

/* ============================================================
   CATEGORIES CRUD
   ============================================================ */

const CategoriesCrud: React.FC = () => {
    const { t, i18n } = useTranslation();
    const [categories, setCategories] = useState<any[]>([]);
    const [editing, setEditing] = useState<any | null>(null);
    const [form, setForm] = useState({ name: '', nameEn: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);

    const fetchCategories = useCallback(async () => {
        setLoading(true);
        try {
            const res = await fetch(`${API_BASE}/categories`, { headers: { 'Accept-Language': i18n.language } });
            const result = await res.json();
            if (result.success) setCategories(result.data);
        } catch { /* fallback */ }
        setLoading(false);
    }, [i18n.language]);

    useEffect(() => { fetchCategories(); }, [fetchCategories]);

    const resetForm = () => { setForm({ name: '', nameEn: '' }); setEditing(null); setError(''); };

    const handleSave = async () => {
        setError('');
        if (!form.name.trim()) { setError(t('admin.categoryName') + ' is required'); return; }

        const payload = editing
            ? { id: editing.id, name: form.name, nameEn: form.nameEn }
            : { name: form.name, nameEn: form.nameEn };

        const url = editing ? `${API_BASE}/categories/${editing.id}` : `${API_BASE}/categories`;
        const method = editing ? 'PUT' : 'POST';

        try {
            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            const result = await res.json();
            if (!res.ok || !result.success) {
                setError(result.message || 'Error');
                return;
            }
            resetForm();
            fetchCategories();
        } catch (err: any) { setError(err.message); }
    };

    const handleDelete = async (id: number) => {
        if (!confirm(t('admin.confirmDelete'))) return;
        try {
            const res = await fetch(`${API_BASE}/categories/${id}`, { method: 'DELETE' });
            const result = await res.json();
            if (!res.ok || !result.success) { alert(result.message || 'Error'); return; }
            fetchCategories();
        } catch (err: any) { alert(err.message); }
    };

    const startEdit = (cat: any) => {
        setEditing(cat);
        setForm({ name: cat.name, nameEn: cat.nameEn || '' });
        setError('');
    };

    return (
        <Card>
            <CardHeader>{t('admin.categories')}</CardHeader>
            <CardBody>
                {/* Form */}
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'flex-end', marginBottom: '1.5rem' }}>
                    <div style={{ flex: '1 1 200px' }}>
                        <Input label={t('admin.categoryName')} value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
                    </div>
                    <div style={{ flex: '1 1 200px' }}>
                        <Input label={t('admin.categoryNameEn')} value={form.nameEn} onChange={e => setForm({ ...form, nameEn: e.target.value })} />
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <Button variant="primary" onClick={handleSave}>
                            <Plus size={16} /> {editing ? t('admin.save') : t('admin.create')}
                        </Button>
                        {editing && <Button variant="outline" onClick={resetForm}>{t('admin.cancel')}</Button>}
                    </div>
                </div>
                {error && <div style={{ color: 'var(--color-error)', marginBottom: '1rem', fontSize: '0.875rem' }}>{error}</div>}

                {/* Table */}
                {loading ? <p>Loading...</p> : categories.length === 0 ? <p style={{ color: 'var(--color-text-secondary)' }}>{t('admin.noCategories')}</p> : (
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ borderBottom: '2px solid var(--color-border)', textAlign: 'left' }}>
                                    <th style={{ padding: '0.75rem' }}>ID</th>
                                    <th style={{ padding: '0.75rem' }}>{t('admin.categoryName')}</th>
                                    <th style={{ padding: '0.75rem' }}>{t('admin.categoryNameEn')}</th>
                                    <th style={{ padding: '0.75rem' }}>{t('admin.actions')}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {categories.map(cat => (
                                    <tr key={cat.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                                        <td style={{ padding: '0.75rem' }}>{cat.id}</td>
                                        <td style={{ padding: '0.75rem' }}>{cat.name}</td>
                                        <td style={{ padding: '0.75rem' }}>{cat.nameEn}</td>
                                        <td style={{ padding: '0.75rem' }}>
                                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                <Button variant="outline" size="sm" onClick={() => startEdit(cat)}><Pencil size={14} /></Button>
                                                <Button variant="outline" size="sm" onClick={() => handleDelete(cat.id)}><Trash2 size={14} /></Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </CardBody>
        </Card>
    );
};

/* ============================================================
   PRODUCTS CRUD
   ============================================================ */

const ProductsCrud: React.FC = () => {
    const { t, i18n } = useTranslation();
    const [products, setProducts] = useState<any[]>([]);
    const [categories, setCategories] = useState<any[]>([]);
    const [editing, setEditing] = useState<any | null>(null);
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState({ title: '', titleEn: '', description: '', descriptionEn: '', price: '', imageUrl: '', categoryId: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);

    // Pexels search state
    const [pexelsQuery, setPexelsQuery] = useState('');
    const [pexelsResults, setPexelsResults] = useState<any[]>([]);
    const [pexelsLoading, setPexelsLoading] = useState(false);

    const fetchProducts = useCallback(async () => {
        setLoading(true);
        try {
            const res = await fetch(`${API_BASE}/products`, { headers: { 'Accept-Language': i18n.language } });
            const result = await res.json();
            if (result.success) setProducts(result.data);
        } catch { /* fallback */ }
        setLoading(false);
    }, [i18n.language]);

    const fetchCategories = useCallback(async () => {
        try {
            const res = await fetch(`${API_BASE}/categories`, { headers: { 'Accept-Language': i18n.language } });
            const result = await res.json();
            if (result.success) setCategories(result.data);
        } catch { /* fallback */ }
    }, [i18n.language]);

    useEffect(() => { fetchProducts(); fetchCategories(); }, [fetchProducts, fetchCategories]);

    const resetForm = () => {
        setForm({ title: '', titleEn: '', description: '', descriptionEn: '', price: '', imageUrl: '', categoryId: '' });
        setEditing(null);
        setShowForm(false);
        setError('');
        setPexelsResults([]);
        setPexelsQuery('');
    };

    const handleSave = async () => {
        setError('');
        if (!form.title.trim() || !form.price || !form.categoryId) {
            setError('Title, Price, and Category are required');
            return;
        }

        const payload: any = {
            title: form.title,
            titleEn: form.titleEn,
            description: form.description,
            descriptionEn: form.descriptionEn,
            price: parseFloat(form.price),
            imageUrl: form.imageUrl,
            categoryId: parseInt(form.categoryId)
        };
        if (editing) payload.id = editing.id;

        const url = editing ? `${API_BASE}/products/${editing.id}` : `${API_BASE}/products`;
        const method = editing ? 'PUT' : 'POST';

        try {
            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            const result = await res.json();
            if (!res.ok || !result.success) {
                setError(result.message || 'Error');
                return;
            }
            resetForm();
            fetchProducts();
        } catch (err: any) { setError(err.message); }
    };

    const handleDelete = async (id: number) => {
        if (!confirm(t('admin.confirmDelete'))) return;
        try {
            const res = await fetch(`${API_BASE}/products/${id}`, { method: 'DELETE' });
            const result = await res.json();
            if (!res.ok || !result.success) { alert(result.message || 'Error'); return; }
            fetchProducts();
        } catch (err: any) { alert(err.message); }
    };

    const startEdit = (prod: any) => {
        setEditing(prod);
        setForm({
            title: prod.title || '',
            titleEn: prod.titleEn || '',
            description: prod.description || '',
            descriptionEn: prod.descriptionEn || '',
            price: String(prod.price || ''),
            imageUrl: prod.imageUrl || '',
            categoryId: String(prod.categoryId || prod.category?.id || '')
        });
        setShowForm(true);
        setError('');
    };

    const searchPexels = async () => {
        if (!pexelsQuery.trim()) return;
        setPexelsLoading(true);
        try {
            const res = await fetch(`${API_BASE}/pexels/search?query=${encodeURIComponent(pexelsQuery)}&per_page=6&size=small`);
            const data = await res.json();
            setPexelsResults(data.photos || []);
        } catch { setPexelsResults([]); }
        setPexelsLoading(false);
    };

    const selectPexelsImage = (url: string) => {
        setForm({ ...form, imageUrl: url });
        setPexelsResults([]);
        setPexelsQuery('');
    };

    return (
        <div>
            {/* Action bar */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem' }}>
                {!showForm && (
                    <Button variant="primary" onClick={() => setShowForm(true)}>
                        <Plus size={16} /> {t('admin.create')}
                    </Button>
                )}
            </div>

            {/* Product Form */}
            {showForm && (
                <Card style={{ marginBottom: '2rem' }}>
                    <CardHeader>{editing ? t('admin.edit') : t('admin.create')} — {t('admin.products')}</CardHeader>
                    <CardBody>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
                            <Input label={t('admin.productTitle')} value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
                            <Input label={t('admin.productTitleEn')} value={form.titleEn} onChange={e => setForm({ ...form, titleEn: e.target.value })} />
                            <Input label={t('admin.productDesc')} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
                            <Input label={t('admin.productDescEn')} value={form.descriptionEn} onChange={e => setForm({ ...form, descriptionEn: e.target.value })} />
                            <Input label={t('admin.productPrice')} type="number" step="0.01" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} />
                            <div className="input-group">
                                <label className="input-label">{t('admin.productCategory')}</label>
                                <select
                                    className="input-control"
                                    style={{ width: '100%' }}
                                    value={form.categoryId}
                                    onChange={e => setForm({ ...form, categoryId: e.target.value })}
                                >
                                    <option value="">--</option>
                                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                </select>
                            </div>
                        </div>

                        {/* Image URL + Pexels Search */}
                        <div style={{ marginBottom: '1rem' }}>
                            <Input label={t('admin.productImage')} value={form.imageUrl} onChange={e => setForm({ ...form, imageUrl: e.target.value })} />
                            {form.imageUrl && (
                                <div style={{ marginTop: '0.5rem', borderRadius: 'var(--radius-md)', overflow: 'hidden', maxWidth: '200px' }}>
                                    <img src={form.imageUrl} alt="Preview" style={{ width: '100%', height: '120px', objectFit: 'cover' }} />
                                </div>
                            )}
                        </div>

                        {/* Pexels Image Search */}
                        <div style={{ padding: '1rem', backgroundColor: 'var(--color-background)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', marginBottom: '1rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                                <ImageIcon size={18} />
                                <strong>{t('admin.searchImages')}</strong>
                            </div>
                            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
                                <Input
                                    placeholder={t('admin.searchPlaceholder')}
                                    value={pexelsQuery}
                                    onChange={e => setPexelsQuery(e.target.value)}
                                    onKeyDown={e => e.key === 'Enter' && searchPexels()}
                                    style={{ flex: '1 1 200px', marginBottom: 0 }}
                                />
                                <Button variant="outline" onClick={searchPexels} disabled={pexelsLoading}>
                                    <Search size={16} /> {pexelsLoading ? '...' : 'Search'}
                                </Button>
                            </div>
                            {pexelsResults.length > 0 && (
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: '0.5rem' }}>
                                    {pexelsResults.map((photo: any) => (
                                        <div
                                            key={photo.id}
                                            onClick={() => selectPexelsImage(photo.src.medium)}
                                            style={{
                                                cursor: 'pointer',
                                                borderRadius: 'var(--radius-sm)',
                                                overflow: 'hidden',
                                                border: form.imageUrl === photo.src.medium ? '3px solid var(--color-primary)' : '2px solid var(--color-border)',
                                                transition: 'border-color 0.2s ease'
                                            }}
                                        >
                                            <img src={photo.src.tiny} alt={photo.alt || 'Pexels photo'} style={{ width: '100%', height: '80px', objectFit: 'cover', display: 'block' }} />
                                        </div>
                                    ))}
                                </div>
                            )}
                            <p style={{ color: 'var(--color-text-disabled)', fontSize: '0.7rem', marginTop: '0.5rem' }}>Photos provided by <a href="https://www.pexels.com" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-primary)' }}>Pexels</a></p>
                        </div>

                        {error && <div style={{ color: 'var(--color-error)', marginBottom: '1rem', fontSize: '0.875rem' }}>{error}</div>}

                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <Button variant="primary" onClick={handleSave}>{t('admin.save')}</Button>
                            <Button variant="outline" onClick={resetForm}>{t('admin.cancel')}</Button>
                        </div>
                    </CardBody>
                </Card>
            )}

            {/* Products Table */}
            {loading ? <p>Loading...</p> : products.length === 0 ? <p style={{ color: 'var(--color-text-secondary)' }}>{t('admin.noProducts')}</p> : (
                <Card>
                    <CardBody>
                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead>
                                    <tr style={{ borderBottom: '2px solid var(--color-border)', textAlign: 'left' }}>
                                        <th style={{ padding: '0.75rem' }}>ID</th>
                                        <th style={{ padding: '0.75rem' }}>{t('admin.productImage')}</th>
                                        <th style={{ padding: '0.75rem' }}>{t('admin.productTitle')}</th>
                                        <th style={{ padding: '0.75rem' }}>{t('admin.productPrice')}</th>
                                        <th style={{ padding: '0.75rem' }}>{t('admin.productCategory')}</th>
                                        <th style={{ padding: '0.75rem' }}>{t('admin.actions')}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {products.map(p => (
                                        <tr key={p.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                                            <td style={{ padding: '0.75rem' }}>{p.id}</td>
                                            <td style={{ padding: '0.75rem' }}>
                                                {p.imageUrl && <img src={p.imageUrl} alt={p.title} style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: 'var(--radius-sm)' }} />}
                                            </td>
                                            <td style={{ padding: '0.75rem' }}>{p.title}</td>
                                            <td style={{ padding: '0.75rem' }}>${p.price}</td>
                                            <td style={{ padding: '0.75rem' }}>{p.category?.name || '-'}</td>
                                            <td style={{ padding: '0.75rem' }}>
                                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                    <Button variant="outline" size="sm" onClick={() => startEdit(p)}><Pencil size={14} /></Button>
                                                    <Button variant="outline" size="sm" onClick={() => handleDelete(p.id)}><Trash2 size={14} /></Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </CardBody>
                </Card>
            )}
        </div>
    );
};

export default Admin;

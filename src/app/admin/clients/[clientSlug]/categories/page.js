"use client";
import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useData } from '@/context/DataContext';
import Button from '@/components/ui/Button/Button';
import { ArrowLeft, Save, RefreshCw, Smartphone, X, Package, ExternalLink } from 'lucide-react';
import { useToast } from '@/components/ui/Toast/ToastProvider';
import styles from './page.module.css';

export default function CategoryManagement() {
    const params = useParams();
    const router = useRouter();
    const { getClientBySlug, getClientCategories, updateCategory, syncCategories, isLoaded, getProductsByClientId } = useData();
    const { addToast } = useToast();

    const [client, setClient] = useState(null);
    const [categories, setCategories] = useState([]);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [syncing, setSyncing] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);

    useEffect(() => {
        if (isLoaded && params?.clientSlug) {
            const found = getClientBySlug(params.clientSlug);
            setClient(found);
            if (found) {
                fetchCategories(found.id);
                setProducts(getProductsByClientId(found.id));
            }
        }
    }, [isLoaded, params, getClientBySlug, getProductsByClientId]);

    const fetchCategories = async (clientId) => {
        try {
            setLoading(true);
            const data = await getClientCategories(clientId);
            setCategories(data);
        } catch (error) {
            console.error(error);
            addToast("Erro ao carregar categorias.", "error");
        } finally {
            setLoading(false);
        }
    };

    const handleSync = async () => {
        if (!client) return;
        setSyncing(true);
        try {
            await syncCategories(client.id);
            addToast("Categorias sincronizadas com sucesso!", "success");
            fetchCategories(client.id); // Refresh list
        } catch (error) {
            addToast("Erro ao sincronizar categorias.", "error");
        } finally {
            setSyncing(false);
        }
    };

    const handleEmojiChange = (id, emoji) => {
        setCategories(prev => prev.map(c => c.id === id ? { ...c, emoji } : c));
    };

    const handleSave = async (category) => {
        try {
            await updateCategory(category.id, { emoji: category.emoji });
            addToast("Emoji atualizado!", "success");
        } catch (error) {
            addToast("Erro ao salvar emoji.", "error");
        }
    };

    const handleCategoryClick = (category) => {
        setSelectedCategory(category);
    };

    const getCategoryProducts = (categoryName) => {
        if (!categoryName) return [];
        return products.filter(p => p.category?.toLowerCase() === categoryName.toLowerCase());
    };

    if (!isLoaded || !client) return <div className={styles.loading}>Carregando...</div>;

    return (
        <div className={styles.container}>
            <div className={styles.topBar}>
                <Link href={`/admin/clients/${client.slug}`} className={styles.backLink}>
                    <ArrowLeft size={16} /> Voltar para Loja
                </Link>
            </div>

            <header className={styles.header}>
                <div>
                    <h1 className={styles.title}>Categorias: {client.name}</h1>
                    <p className={styles.subtitle}>Gerencie os emojis e a ordem das categorias.</p>
                </div>
                <Button
                    variant="secondary"
                    icon={RefreshCw}
                    onClick={handleSync}
                    loading={syncing}
                >
                    {syncing ? "Sincronizando..." : "Sincronizar"}
                </Button>
            </header>

            <div className={styles.grid}>
                {categories.map(cat => (
                    <div key={cat.id} className={styles.card}>
                        <div className={styles.cardHeader}>
                            <h3 className={styles.catName}>{cat.name}</h3>
                            <span
                                className={styles.badge}
                                onClick={() => handleCategoryClick(cat)}
                                title="Ver produtos desta categoria"
                            >
                                {cat.productsCount || 0} produtos
                            </span>
                        </div>

                        <div className={styles.inputGroup}>
                            <label>Emoji</label>
                            <div className={styles.inputWrapper}>
                                <input
                                    type="text"
                                    value={cat.emoji || ''}
                                    onChange={e => handleEmojiChange(cat.id, e.target.value)}
                                    placeholder="Ex: 🍎"
                                    className={styles.input}
                                />
                                <Button
                                    size="sm"
                                    onClick={() => handleSave(cat)}
                                    icon={Save}
                                >
                                    Salvar
                                </Button>
                            </div>
                        </div>
                    </div>
                ))}

                {categories.length === 0 && !loading && (
                    <div className={styles.empty}>
                        Nenhuma categoria encontrada. As categorias são criadas automaticamente ao importar produtos.
                    </div>
                )}
            </div>

            {/* Modal de Produtos da Categoria */}
            {selectedCategory && (
                <div className={styles.modalOverlay} onClick={() => setSelectedCategory(null)}>
                    <div className={styles.modal} onClick={e => e.stopPropagation()}>
                        <div className={styles.modalHeader}>
                            <div className={styles.modalTitle}>
                                <span style={{ fontSize: '1.5rem' }}>{selectedCategory.emoji || '📦'}</span>
                                {selectedCategory.name}
                            </div>
                            <button className={styles.closeButton} onClick={() => setSelectedCategory(null)}>
                                <X size={20} />
                            </button>
                        </div>

                        <div className={styles.modalContent}>
                            {getCategoryProducts(selectedCategory.name).length > 0 ? (
                                <div className={styles.productList}>
                                    {getCategoryProducts(selectedCategory.name).map(product => (
                                        <div
                                            key={product.id}
                                            className={styles.productItem}
                                            onClick={() => router.push(`/admin/clients/${client.slug}/products/${product.id}`)}
                                        >
                                            <div className={styles.productInfo}>
                                                <div className={styles.productIcon}>
                                                    <Package size={18} />
                                                </div>
                                                <div>
                                                    <div className={styles.productName}>{product.name}</div>
                                                    <div className={styles.productPrice}>R$ {product.price?.toFixed(2) || '0.00'}</div>
                                                </div>
                                            </div>
                                            <ExternalLink size={16} color="#94a3b8" />
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div style={{ textAlign: 'center', padding: '2rem', color: '#94a3b8' }}>
                                    Nenhum produto nesta categoria.
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

function Link({ href, children, className }) {
    const router = useRouter();
    return (
        <a
            href={href}
            onClick={(e) => { e.preventDefault(); router.push(href); }}
            className={className}
        >
            {children}
        </a>
    );
}

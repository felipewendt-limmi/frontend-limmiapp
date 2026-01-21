"use client";
import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import CanvasBackground from '@/components/layout/CanvasBackground/CanvasBackground';
import Button from '@/components/ui/Button/Button';
import { ArrowLeft, Check, Heart, Droplets, Leaf, ExternalLink, TriangleAlert } from 'lucide-react';
import { clsx } from 'clsx';
import Skeleton from '@/components/ui/Skeleton/Skeleton';
import EmptyState from '@/components/ui/EmptyState/EmptyState';
import NutritionTable from '@/components/business/NutritionTable/NutritionTable';
import { useToast } from '@/components/ui/Toast/ToastProvider';
import { useData } from '@/context/DataContext';
import styles from './page.module.css';

export default function ProductDetail() {
    const params = useParams();
    const { getClientBySlug, isLoaded, getClientCategories } = useData();

    // 1. All useState hooks at the top
    const [loading, setLoading] = useState(true);
    const [product, setProduct] = useState(null);
    const [client, setClient] = useState(null);
    const [categoryEmoji, setCategoryEmoji] = useState(null);
    const [mounted, setMounted] = useState(false);
    const [isFavorite, setIsFavorite] = useState(false);

    // 2. All useEffect hooks
    useEffect(() => {
        setMounted(true);
    }, []);

    // Helper function moved inside to avoid deps issue or defined securely
    const toggleFavorite = () => {
        if (!product || !params?.clientSlug) return;
        const favoritesKey = `limmi_favorites_${params.clientSlug}`;
        try {
            const stored = JSON.parse(localStorage.getItem(favoritesKey) || '[]');
            const exists = stored.some(p => p.id === product.id);
            let newFavorites;

            if (exists) {
                newFavorites = stored.filter(p => p.id !== product.id);
                setIsFavorite(false);
            } else {
                newFavorites = [...stored, {
                    id: product.id,
                    slug: product.slug,
                    name: product.name,
                    emoji: product.emoji,
                    category: product.category,
                    price: product.price
                }];
                setIsFavorite(true);
            }
            localStorage.setItem(favoritesKey, JSON.stringify(newFavorites));
        } catch (e) {
            console.error("Error saving favorites", e);
        }
    };

    // Load Data Effect
    useEffect(() => {
        // Guard clause inside effect, not before
        if (!mounted || !isLoaded || !params?.clientSlug || !params?.productSlug) return;

        const loadData = async () => {
            const clientFound = getClientBySlug(params.clientSlug);
            if (clientFound && clientFound.isActive) {
                setClient(clientFound);
                const found = clientFound.products.find(p => p.slug === params.productSlug && p.isActive);
                setProduct(found);

                if (found?.category) {
                    try {
                        const categories = await getClientCategories(clientFound.id);
                        // Robust comparison
                        const cat = categories.find(c => c.name.toLowerCase().trim() === found.category.toLowerCase().trim());
                        if (cat) setCategoryEmoji(cat.emoji);
                    } catch (err) { console.error(err); }
                }
            }
            setLoading(false);
        };
        loadData();
    }, [mounted, isLoaded, params, getClientBySlug, getClientCategories]);

    // Load Favorites Effect
    useEffect(() => {
        if (mounted && product && params?.clientSlug) {
            const favoritesKey = `limmi_favorites_${params.clientSlug}`;
            try {
                const stored = JSON.parse(localStorage.getItem(favoritesKey) || '[]');
                setIsFavorite(stored.some(p => p.id === product.id));
            } catch (e) {
                console.error("Error reading favorites", e);
            }
        }
    }, [mounted, product, params.clientSlug]);


    // 3. Conditional Rendering (only after all hooks declared)
    if (!mounted) return null;
    if (!loading && !product) return <EmptyState title="Produto não encontrado" />;

    return (
        <main className={styles.container}>
            {/* Blue Gradient Header */}
            <header className={styles.header}>
                {loading ? (
                    <div className={styles.headerLoading} />
                ) : (
                    <div className={styles.headerContent}>
                        {/* System Logo - Left */}
                        <div className={styles.logoWrapper}>
                            <img src="/logo.jpg" alt="LIMMI" className={styles.systemLogo} />
                        </div>

                        {/* Category Emoji - Center */}
                        <div className={styles.storeIcon}>
                            {categoryEmoji || '📦'}
                        </div>

                        {/* Store Logo - Right */}
                        <div className={styles.logoWrapper}>
                            {client?.logo ? (
                                <img src={client.logo} alt={client.name} className={styles.storeLogo} />
                            ) : (
                                <div className={styles.storeLogoPlaceholder} />
                            )}
                        </div>
                    </div>
                )}
                <h1 className={styles.storeName}>{client?.name || 'LIMMI Granel'}</h1>
                <p className={styles.storeSubtitle}>Informações de Produtos a Granel</p>
            </header>

            {/* Floating White Card */}
            <div className={styles.cardContainer}>
                {loading ? (
                    <div className={styles.card} style={{ height: '400px' }}>Loading...</div>
                ) : (
                    <div className={styles.card}>
                        <div className={styles.productHeader}>
                            <div className={styles.productEmoji}>
                                {categoryEmoji || product.emoji || '📦'}
                            </div>
                            <div style={{ flex: 1 }}>
                                <h2 className={styles.productName}>{product.name}</h2>
                                <span className={styles.productCategory}>{product.category || 'Geral'}</span>
                            </div>
                            <button
                                className={styles.likeButton}
                                onClick={toggleFavorite}
                                style={{ background: isFavorite ? '#fff' : 'white', borderColor: isFavorite ? '#ef4444' : '#e2e8f0' }}
                            >
                                <div
                                    className={styles.heartIcon}
                                    style={{ backgroundColor: isFavorite ? '#ef4444' : '#cbd5e1' }}
                                />
                            </button>
                        </div>

                        <p className={styles.description}>
                            {product.description}
                        </p>

                        <div className={styles.nutritionSection}>
                            <div className={styles.sectionTitle}>
                                <span style={{ marginRight: '8px', fontSize: '1.2rem' }}>💧</span>
                                Informações Nutricionais (por 100g)
                            </div>
                            <NutritionTable data={product.nutrition} />
                        </div>

                        {product.benefits && product.benefits.length > 0 && (
                            <div className={styles.dynamicSection}>
                                <div className={styles.sectionTitle}>
                                    <span style={{ marginRight: '8px', fontSize: '1.2rem' }}>🌿</span>
                                    Benefícios Principais
                                </div>
                                <div className={styles.list}>
                                    {product.benefits.map((b, i) => (
                                        <div key={i} className={styles.listItem}>
                                            <div className={styles.checkIcon}>✔</div>
                                            {b}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {product.helpsWith && product.helpsWith.length > 0 && (
                            <div className={styles.dynamicSection}>
                                <div className={styles.sectionTitle}>
                                    <span style={{ marginRight: '8px', fontSize: '1.2rem' }}>✨</span>
                                    Pode Ajudar Com
                                </div>
                                <div className={styles.list}>
                                    {product.helpsWith.map((h, i) => (
                                        <div key={i} className={styles.listItem}>
                                            <div className={styles.checkIcon}>✔</div>
                                            {h}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Tags / Combinations */}
                        {product.tags && product.tags.length > 0 && (
                            <div className={styles.dynamicSection}>
                                <div className={styles.sectionTitle}>
                                    <span style={{ marginRight: '8px', fontSize: '1.2rem' }}>🔗</span>
                                    Combina Bem Com
                                </div>
                                <div className={styles.tags}>
                                    {product.tags.map((t, i) => (
                                        <span key={i} className={styles.tag}>{t}</span>
                                    ))}
                                </div>
                            </div>
                        )}


                        {/* Educational Disclaimer */}
                        <div className={styles.disclaimerBox}>
                            <span style={{ fontSize: '1.2rem' }}>ℹ️</span>
                            <div>
                                <strong>Informação Educacional:</strong> Este conteúdo é apenas informativo e não substitui orientação médica profissional. Consulte um médico ou nutricionista antes de usar como tratamento.
                            </div>
                        </div>

                        {/* Favorites Navigation Button */}
                        <Link href={`/${params.clientSlug}/favorites`} className={styles.favoritesButton}>
                            Ver Meus Favoritos <Heart size={18} fill={isFavorite ? "#ef4444" : "none"} color={isFavorite ? "#ef4444" : "currentColor"} />
                        </Link>

                        <div style={{ marginTop: '2rem', textAlign: 'center' }}>
                            <div style={{ fontSize: '0.8rem', color: '#cbd5e1' }}>
                                Versão 1.0 | Janeiro 2026
                            </div>
                        </div>

                    </div>
                )}
            </div>
        </main>
    );
}

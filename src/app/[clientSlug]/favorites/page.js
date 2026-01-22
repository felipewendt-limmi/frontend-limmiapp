"use client";
import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Trash2, ArrowLeft, Heart } from 'lucide-react';
import styles from './page.module.css';

export default function FavoritesPage() {
    const params = useParams();
    const { getGlobalCategories, isLoaded } = useData();
    const [favorites, setFavorites] = useState([]);
    const [globalCategories, setGlobalCategories] = useState([]);
    const [mounted, setMounted] = useState(false);

    const router = useRouter();

    useEffect(() => {
        setMounted(true);
        if (params?.clientSlug) {
            const key = `limmi_favorites_${params.clientSlug}`;
            try {
                const stored = JSON.parse(localStorage.getItem(key) || '[]');
                setFavorites(stored);
            } catch (e) {
                console.error("Error loading favorites", e);
            }
        }
    }, [params]);

    // Fetch Global Categories to ensure emojis are up to date
    useEffect(() => {
        if (isLoaded) {
            const loadGlobal = async () => {
                const c = await getGlobalCategories();
                setGlobalCategories(c);
            };
            loadGlobal();
        }
    }, [isLoaded, getGlobalCategories]);

    const getEmoji = (product) => {
        const globalCat = globalCategories.find(c => c.name.toLowerCase().trim() === (product.category || '').toLowerCase().trim());
        return globalCat?.emoji || product.emoji || '📦';
    };

    const removeFavorite = (e, id) => {
        e.preventDefault();
        e.stopPropagation();

        const newFavorites = favorites.filter(p => p.id !== id);
        setFavorites(newFavorites);

        const key = `limmi_favorites_${params.clientSlug}`;
        localStorage.setItem(key, JSON.stringify(newFavorites));
    };

    if (!mounted) return null;

    return (
        <main className={styles.container}>
            <button onClick={() => router.back()} className={styles.backLink} style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit', fontSize: 'inherit' }}>
                <ArrowLeft size={18} /> Voltar
            </button>

            <header className={styles.header}>
                <h1 className={styles.title}>Meus Favoritos</h1>
                <p className={styles.subtitle}>Seus produtos selecionados</p>
            </header>

            {favorites.length === 0 ? (
                <div className={styles.emptyState}>
                    <Heart size={64} className={styles.emptyIcon} />
                    <h3>Você ainda não tem favoritos</h3>
                    <p className={styles.emptyText}>Você ainda não marcou nenhum produto como favorito.</p>
                </div>
            ) : (
                <div className={styles.grid}>
                    {favorites.map((product) => (
                        <Link
                            key={product.id}
                            href={`/${params.clientSlug}/${product.slug}`}
                            className={styles.card}
                        >
                            <button
                                className={styles.removeButton}
                                onClick={(e) => removeFavorite(e, product.id)}
                            >
                                <Heart size={14} fill="#ef4444" color="#ef4444" />
                            </button>
                            <div className={styles.emoji}>{getEmoji(product)}</div>
                            <div className={styles.productName}>{product.name}</div>
                            <div className={styles.category}>{product.category}</div>
                        </Link>
                    ))}
                </div>
            )}
        </main>
    );
}

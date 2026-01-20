"use client";
import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import CanvasBackground from '@/components/layout/CanvasBackground/CanvasBackground';
import Button from '@/components/ui/Button/Button';
import { ArrowLeft, Check, Heart } from 'lucide-react';
import { clsx } from 'clsx';
import Skeleton from '@/components/ui/Skeleton/Skeleton';
import EmptyState from '@/components/ui/EmptyState/EmptyState';
import NutritionTable from '@/components/business/NutritionTable/NutritionTable';
import { useToast } from '@/components/ui/Toast/ToastProvider';
import { useData } from '@/context/DataContext';
import styles from './page.module.css';

export default function ProductDetail() {
    const params = useParams();
    const { getClientBySlug, isLoaded } = useData();
    const [loading, setLoading] = useState(true);
    const [product, setProduct] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null);
    const [isFavorite, setIsFavorite] = useState(false);
    const { addToast } = useToast();

    useEffect(() => {
        if (!isLoaded || !params?.clientSlug || !params?.productSlug) return;

        // Simulate Loading for effect
        const timer = setTimeout(() => {
            const client = getClientBySlug(params.clientSlug);
            if (client && client.isActive) {
                const found = client.products.find(p => p.slug === params.productSlug && p.isActive);
                setProduct(found);
                if (found) {
                    // Prioritize images array, then single image, then placeholder
                    const initialImg = (found.images && found.images.length > 0)
                        ? found.images[0]
                        : (found.image || `https://placehold.co/600x600/png?text=${found.name}`);
                    setSelectedImage(initialImg);
                }
            }
            setLoading(false);
        }, 1000);
        return () => clearTimeout(timer);
    }, [isLoaded, params, getClientBySlug]);

    useEffect(() => {
        // Load favorite status from localStorage
        const storedFavorites = JSON.parse(localStorage.getItem('favorites') || '[]');
        if (product && storedFavorites.includes(product.id)) {
            setIsFavorite(true);
        }
    }, [product]);

    const toggleFavorite = () => {
        const storedFavorites = JSON.parse(localStorage.getItem('favorites') || '[]');
        let newFavorites;

        if (isFavorite) {
            newFavorites = storedFavorites.filter(id => id !== product.id);
            addToast("Removido dos favoritos.", "info");
        } else {
            newFavorites = [...storedFavorites, product.id];
            addToast("Produto salvo para lembrar depois!", "success");
        }

        localStorage.setItem('favorites', JSON.stringify(newFavorites));
        setIsFavorite(!isFavorite);
    };

    if (!loading && !product) {
        return (
            <>
                <Header />
                <div className={styles.emptyStateContainer}>
                    <EmptyState title="Produto não encontrado" />
                </div>
            </>
        );
    }

    return (
        <>
            <CanvasBackground />
            <main className={styles.container}>
                <section className={styles.imageSection}>
                    {loading ? (
                        <Skeleton width="100%" height="100%" />
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: '1rem' }}>
                            {/* Main Image */}
                            <div style={{ position: 'relative', flex: 1, borderRadius: '16px', overflow: 'hidden', minHeight: '300px' }}>
                                <Image
                                    src={selectedImage}
                                    alt={product.name}
                                    fill
                                    style={{ objectFit: 'cover' }}
                                />
                            </div>

                            {/* Thumbnails */}
                            {product.images && product.images.length > 1 && (
                                <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '4px' }}>
                                    {product.images.map((img, idx) => (
                                        <div
                                            key={idx}
                                            onClick={() => setSelectedImage(img)}
                                            style={{
                                                width: '80px',
                                                height: '80px',
                                                position: 'relative',
                                                borderRadius: '8px',
                                                overflow: 'hidden',
                                                cursor: 'pointer',
                                                border: selectedImage === img ? '2px solid #3b82f6' : '1px solid #e2e8f0',
                                                flexShrink: 0
                                            }}
                                        >
                                            <Image
                                                src={img}
                                                alt={`View ${idx}`}
                                                fill
                                                style={{ objectFit: 'cover' }}
                                            />
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </section>

                <section className={styles.detailsSection}>
                    {loading ? (
                        <>
                            <Skeleton width="30%" height="1rem" />
                            <Skeleton width="80%" height="3rem" style={{ marginBottom: '1rem' }} />
                            <Skeleton width="40%" height="2rem" />
                            <Skeleton width="100%" height="100px" style={{ marginTop: '1rem' }} />
                        </>
                    ) : (
                        <>
                            <Link href={`/${params.clientSlug}`} className={styles.breadcrumbs}>
                                <ArrowLeft size={16} /> Voltar para a loja
                            </Link>

                            <h1 className={styles.title}>{product.name}</h1>

                            <div className={styles.price}>
                                {product.price} <span className={styles.unit}>/ {product.unit}</span>
                            </div>

                            <p className={styles.description}>{product.description}</p>

                            {product.benefits && (
                                <div className={styles.benefits}>
                                    {product.benefits.map((benefit, i) => (
                                        <span key={i} className={styles.benefitTag}>
                                            <Check size={14} /> {benefit}
                                        </span>
                                    ))}
                                </div>
                            )}

                            {/* Usage Tips Section */}
                            {product.tips && (
                                <div style={{ marginTop: '2rem', padding: '1.5rem', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                                    <h3 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '1rem', color: '#1e293b' }}>Dicas de Consumo:</h3>
                                    <ul style={{ listStyle: 'disc', paddingLeft: '1.5rem', color: '#475569', lineHeight: '1.6' }}>
                                        {product.tips.map((tip, i) => (
                                            <li key={i} style={{ marginBottom: '0.5rem' }}>{tip}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {/* Pairs Well With Section */}
                            {product.combinations && (
                                <div style={{ marginTop: '2rem' }}>
                                    <h3 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '1rem', color: '#1e293b' }}>Combina Bem Com:</h3>
                                    <div className={styles.benefits}>
                                        {product.combinations.map((item, i) => (
                                            <span key={i} className={styles.benefitTag} style={{ background: '#f1f5f9', color: '#475569', border: '1px solid #e2e8f0' }}>
                                                {item}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className={styles.actions}>
                                <Button
                                    className={clsx(styles.favButton, isFavorite && styles.favActive)}
                                    onClick={toggleFavorite}
                                    style={{ width: '100%', gap: '12px', fontSize: '1.1rem', padding: '1rem' }}
                                >
                                    <Heart size={24} fill={isFavorite ? "currentColor" : "none"} />
                                    {isFavorite ? "Remover dos Favoritos" : "Adicionar aos Favoritos"}
                                </Button>
                            </div>

                            <div style={{ marginTop: '2rem' }}>
                                <NutritionTable data={product.nutrition} />
                            </div>

                            {/* Legal Disclaimer */}
                            <div style={{ marginTop: '3rem', padding: '1.5rem', background: '#ecfdf5', borderRadius: '12px', border: '1px solid #a7f3d0', color: '#065f46', fontSize: '0.9rem', lineHeight: '1.5' }}>
                                <strong>Informação Educacional:</strong> Este conteúdo é apenas informativo e não substitui orientação médica profissional. Consulte um médico ou nutricionista antes de usar como tratamento.
                            </div>
                        </>
                    )}
                </section>
            </main>
        </>
    );
}

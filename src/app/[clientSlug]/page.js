"use client";
import React, { useState, useEffect } from 'react';
import { useData } from '@/context/DataContext';
import ProductCard from '@/components/business/ProductCard/ProductCard';
import CanvasBackground from '@/components/layout/CanvasBackground/CanvasBackground';
import EmptyState from '@/components/ui/EmptyState/EmptyState';
import styles from './page.module.css';
import { useParams } from 'next/navigation';

export default function StoreHome() {
    const params = useParams();
    const { getClientBySlug, isLoaded } = useData();
    const [client, setClient] = useState(null);

    useEffect(() => {
        if (isLoaded && params?.clientSlug) {
            const foundClient = getClientBySlug(params.clientSlug);
            setClient(foundClient);
        }
    }, [isLoaded, params, getClientBySlug]);

    if (!isLoaded) return null; // Or a loading spinner

    if (!client || !client.isActive) {
        return (
            <>
                <div style={{ paddingTop: '100px', textAlign: 'center' }}>
                    <EmptyState title="Loja não encontrada ou indisponível" />
                </div>
            </>
        );
    }

    const activeProducts = client.products.filter(p => p.isActive);

    return (
        <>
            <CanvasBackground />
            <main className={styles.container}>
                <section className={styles.hero} style={{
                    backgroundImage: client.coverImage ? `url(${client.coverImage})` : 'none',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    // Dim the background if image exists, or use solid color if not
                    backgroundColor: client.coverImage ? 'rgba(0,0,0,0.5)' : '#ffffff',
                    backgroundBlendMode: 'overlay',
                    color: client.coverImage ? '#ffffff' : '#0f172a',
                    padding: '6rem 2rem',
                    borderRadius: '24px',
                    marginBottom: '3rem',
                    textAlign: 'center',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: '300px'
                }}>
                    <h1 className={styles.title} style={{
                        fontSize: '3rem',
                        fontWeight: '800',
                        marginBottom: '1rem',
                        textShadow: client.coverImage ? '0 2px 4px rgba(0,0,0,0.3)' : 'none'
                    }}>
                        {client.name}
                    </h1>
                    <p className={styles.description} style={{
                        fontSize: '1.2rem',
                        maxWidth: '600px',
                        margin: '0 auto',
                        opacity: 0.9,
                        lineHeight: 1.6
                    }}>
                        {client.description || "Bem-vindo à nossa loja virtual."}
                    </p>
                </section>

                <h2 className={styles.sectionTitle}>Nossos Produtos</h2>

                {activeProducts.length > 0 ? (
                    <div className={styles.grid}>
                        {activeProducts.map(product => (
                            <ProductCard key={product.id} product={product} clientSlug={client.slug} />
                        ))}
                    </div>
                ) : (
                    <EmptyState title="Nenhum produto cadastrado" />
                )}
            </main>
        </>
    );
}

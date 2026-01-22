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
    const { getClientBySlug, isLoaded, trackClientVisit } = useData();
    const [client, setClient] = useState(null);

    useEffect(() => {
        if (isLoaded && params?.clientSlug) {
            const foundClient = getClientBySlug(params.clientSlug);
            setClient(foundClient);

            // Track Visit
            if (foundClient) {
                trackClientVisit(foundClient.id); // Optimized call
            }
        }
    }, [isLoaded, params, getClientBySlug, trackClientVisit]);

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
                    // Stronger overlay for readability
                    backgroundColor: client.coverImage ? 'rgba(0,0,0,0.6)' : '#ffffff',
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
                    minHeight: '350px',
                    boxShadow: '0 20px 40px -10px rgba(0,0,0,0.2)'
                }}>
                    <h1 className={styles.title} style={{
                        fontSize: '3.5rem',
                        fontWeight: '800',
                        marginBottom: '1rem',
                        textShadow: client.coverImage ? '0 4px 20px rgba(0,0,0,0.5)' : 'none',
                        letterSpacing: '-0.02em',
                        color: client.coverImage ? '#ffffff' : undefined, // Force white if image exists
                    }}>
                        {client.name}
                    </h1>
                    <p className={styles.description} style={{
                        fontSize: '1.25rem',
                        maxWidth: '600px',
                        margin: '0 auto',
                        opacity: 0.95,
                        lineHeight: 1.6,
                        fontWeight: '500',
                        textShadow: client.coverImage ? '0 2px 10px rgba(0,0,0,0.5)' : 'none',
                        color: client.coverImage ? '#e2e8f0' : undefined, // Force light gray/white if image exists
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

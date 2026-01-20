"use client";
import React from 'react';
import Link from 'next/link';
// import Image from 'next/image'; // Switching to <img> for broad external URL support
import styles from './ProductCard.module.css';
import Button from '@/components/ui/Button/Button';
import { ShoppingCart } from 'lucide-react';

export default function ProductCard({ product, clientSlug }) {
    // Mock image handling (placeholder if not present)
    const imageSrc = product.image || `https://placehold.co/400x400/png?text=${product.name}`;

    return (
        <Link href={`/${clientSlug}/${product.slug}`} className={styles.card}>
            <div className={styles.imageWrapper}>
                <img
                    src={imageSrc}
                    alt={product.name}
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover'
                    }}
                    className={styles.image}
                    loading="lazy"
                />
            </div>
            <div className={styles.content}>
                <div className={styles.category}>{product.category}</div>
                <h3 className={styles.title}>{product.name}</h3>
                {/* Price hidden for Base LIMMI (Catalog Mode)
                <div className={styles.price}>
                    {product.price} <span className={styles.unit}>/ {product.unit}</span>
                </div>
                */}

                <div className={styles.actions}>
                    <Button
                        variant="ghost"
                        style={{ width: '100%', fontSize: '0.9rem', padding: '0.6rem', background: '#eff6ff', color: 'var(--primary)' }}
                    >
                        Ver Detalhes
                    </Button>
                </div>
            </div>
        </Link>
    );
}

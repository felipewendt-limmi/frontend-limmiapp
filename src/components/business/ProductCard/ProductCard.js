"use client";
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from './ProductCard.module.css';
import Button from '@/components/ui/Button/Button';
import { ShoppingCart } from 'lucide-react';

export default function ProductCard({ product, clientSlug }) {
    // Mock image handling (placeholder if not present)
    const imageSrc = product.image || `https://placehold.co/400x400/png?text=${product.name}`;

    return (
        <Link href={`/${clientSlug}/${product.slug}`} className={styles.card}>
            <div className={styles.imageWrapper}>
                <Image
                    src={imageSrc}
                    alt={product.name}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className={styles.image}
                />
            </div>
            <div className={styles.content}>
                <div className={styles.category}>{product.category}</div>
                <h3 className={styles.title}>{product.name}</h3>
                <div className={styles.price}>
                    {product.price} <span className={styles.unit}>/ {product.unit}</span>
                </div>

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

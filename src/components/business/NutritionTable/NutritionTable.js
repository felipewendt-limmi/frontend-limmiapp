import React from 'react';
import styles from './NutritionTable.module.css';

export default function NutritionTable({ data }) {
    // Handle both new array format and legacy object format
    const items = Array.isArray(data) ? data : (data?.items || []);

    if (items.length === 0) return null;

    return (
        <div className={styles.container}>
            <div className={styles.header}>Informação Nutricional</div>
            <div>
                {/* Legacy portion support if needed, but for now we iterate items */}
                {data?.portion && (
                    <div className={styles.row}>
                        <span className={styles.label}>Porção</span>
                        <span className={styles.value}>{data.portion}</span>
                    </div>
                )}

                {items.map((item, index) => (
                    <div key={index} className={styles.row}>
                        <span className={styles.label}>{item.label || item.key}</span>
                        <span className={styles.value}>{item.value}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

import React from 'react';
import styles from './EmptyState.module.css';
import { PackageOpen } from 'lucide-react';

export default function EmptyState({ title = "Nada encontrado", description = "Não encontramos nenhum item correspondente.", icon: Icon = PackageOpen }) {
    return (
        <div className={styles.container}>
            <div className={styles.iconWrapper}>
                <Icon size={48} strokeWidth={1.5} color="var(--primary)" />
            </div>
            <h3 className={styles.title}>{title}</h3>
            <p className={styles.description}>{description}</p>
        </div>
    );
}

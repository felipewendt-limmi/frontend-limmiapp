import React from 'react';
import styles from './Toast.module.css';
import { CheckCircle2, Info } from 'lucide-react';
import { clsx } from 'clsx';

export default function Toast({ message, type = 'success', onClose }) {
    const Icon = type === 'success' ? CheckCircle2 : Info;

    return (
        <div className={clsx(styles.toast, styles[type])}>
            <Icon size={20} />
            <span>{message}</span>
        </div>
    );
}

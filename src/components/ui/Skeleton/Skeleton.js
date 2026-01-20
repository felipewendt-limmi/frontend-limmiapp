import React from 'react';
import styles from './Skeleton.module.css';
import { clsx } from 'clsx';

export default function Skeleton({ className, variant = 'text', width, height, style }) {
    const inlineStyles = {
        width,
        height,
        ...style
    };

    return (
        <div
            className={clsx(styles.skeleton, styles[variant], className)}
            style={inlineStyles}
        />
    );
}

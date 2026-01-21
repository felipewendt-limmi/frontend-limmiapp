import React from 'react';
import styles from './Button.module.css';
import { Loader2 } from 'lucide-react';
import { clsx } from 'clsx'; // Assuming clsx is available or just use template literals if simple

export default function Button({
    children,
    variant = 'primary',
    className,
    isLoading,
    icon: Icon,
    fullWidth,
    ...props
}) {
    return (
        <button
            className={clsx(styles.button, styles[variant], className)}
            disabled={isLoading}
            {...props}
        >
            {isLoading && <Loader2 className="animate-spin" size={20} />}
            {!isLoading && Icon && <Icon size={20} />}
            {children}
        </button>
    );
}

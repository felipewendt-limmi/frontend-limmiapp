"use client";
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Users, LogOut, Store } from 'lucide-react';
import styles from './layout.module.css';
import { clsx } from 'clsx';

export default function AdminLayout({ children }) {
    const pathname = usePathname();

    const isActive = (path) => pathname === path;

    return (
        <div className={styles.container}>
            <aside className={styles.sidebar}>
                <div className={styles.logo}>
                    LIMMI Admin
                </div>
                <nav className={styles.nav}>

                    <Link
                        href="/admin/clients"
                        className={clsx(styles.navItem, isActive('/admin/clients') && styles.active)}
                    >
                        <Users size={20} /> Clientes
                    </Link>

                    <div style={{ marginTop: 'auto' }}>
                        <Link href="/" className={styles.navItem}>
                            <Store size={20} /> Ver Site
                        </Link>
                    </div>
                </nav>
            </aside>

            <main className={styles.main}>
                {children}
            </main>
        </div>
    );
}

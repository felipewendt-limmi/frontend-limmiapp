"use client";
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Users, LogOut, Store } from 'lucide-react';
import styles from './layout.module.css';
import { clsx } from 'clsx';

export default function AdminLayout({ children }) {
    const pathname = usePathname();

    const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
    const isActive = (path) => pathname === path;

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
    const closeSidebar = () => setIsSidebarOpen(false);

    return (
        <div className={styles.container}>
            {/* Mobile Header / Hamburger */}
            <div className={styles.mobileHeader}>
                <button onClick={toggleSidebar} className={styles.hamburger}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="3" y1="12" x2="21" y2="12"></line>
                        <line x1="3" y1="6" x2="21" y2="6"></line>
                        <line x1="3" y1="18" x2="21" y2="18"></line>
                    </svg>
                </button>
                <div className={styles.mobileLogo}>LIMMI Admin</div>
            </div>

            {/* Overlay for mobile */}
            {isSidebarOpen && (
                <div className={styles.overlay} onClick={closeSidebar}></div>
            )}

            <aside className={clsx(styles.sidebar, isSidebarOpen && styles.sidebarOpen)}>
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

                    <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                        <Link href="/admin/clients/global-catalog" className={clsx(styles.navItem, isActive('/admin/clients/global-catalog') && styles.active)}>
                            <span style={{ fontSize: '1.2rem', marginRight: '8px' }}>🌍</span> Produtos do Sistema
                        </Link>
                    </div>
                </nav>
            </aside>

            <main className={styles.main}>
                {children}
            </main>
        </div >
    );
}

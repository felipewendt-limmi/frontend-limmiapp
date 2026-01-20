"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from './Header.module.css';
import { Menu, User } from 'lucide-react';
import Button from '@/components/ui/Button/Button';
import { clsx } from 'clsx';

export default function Header() {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <header className={clsx(styles.header, scrolled && styles.scrolled)}>
            <Link href="/" className={styles.logo}>
                <span className="title-gradient">LIMMI</span> Granel
            </Link>

            <nav className={styles.nav}>
                <Link href="/" className={styles.link}>Início</Link>
                <Link href="/emporio-felipe" className={styles.link}>Loja Demo</Link>
                <Link href="/admin/dashboard" className={styles.link}>Admin</Link>
            </nav>

            <div className={styles.actions}>
                <Button variant="ghost" icon={User} className={styles.iconButton} aria-label="Perfil" />
            </div>
        </header>
    );
}

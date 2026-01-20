"use client";
import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/components/ui/Toast/ToastProvider';
import Button from '@/components/ui/Button/Button';
import styles from './page.module.css';

export default function LoginPage() {
    const { login } = useAuth();
    const { addToast } = useToast();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await login(email, password);
            addToast("Login realizado com sucesso!", "success");
        } catch (error) {
            addToast("Email ou senha inválidos.", "error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <div className={styles.header}>
                    <h1>LIMMI Dashboard</h1>
                    <p>Acesse o painel administrativo</p>
                </div>
                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.formGroup}>
                        <label>Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="admin@limmi.com.br"
                            required
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label>Senha</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <Button type="submit" disabled={loading} style={{ width: '100%' }}>
                        {loading ? "Entrando..." : "Entrar"}
                    </Button>
                </form>
            </div>
        </div>
    );
}

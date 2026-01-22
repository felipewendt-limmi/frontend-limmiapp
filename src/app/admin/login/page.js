"use client";
import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/components/ui/Toast/ToastProvider';
import Button from '@/components/ui/Button/Button';
import styles from './page.module.css';

export default function LoginPage() {
    const { login, verifyCode } = useAuth();
    const { addToast } = useToast();

    // Step 1 State
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    // Step 2 State
    const [step, setStep] = useState(1);
    const [code, setCode] = useState("");
    const [tempToken, setTempToken] = useState("");

    const [loading, setLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const data = await login(email, password);
            if (data.requires2FA) {
                setTempToken(data.tempToken);
                setStep(2);
                addToast("Credenciais aceitas. Verifique seu email.", "success");
            } else {
                addToast("Login realizado com sucesso!", "success");
            }
        } catch (error) {
            addToast("Email ou senha inválidos.", "error");
        } finally {
            setLoading(false);
        }
    };

    const handleVerify = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await verifyCode(tempToken, code);
            addToast("Acesso liberado!", "success");
        } catch (error) {
            addToast("Código inválido ou expirado.", "error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <div className={styles.header}>
                    <h1>LIMMI Dashboard</h1>
                    <p>{step === 1 ? "Acesse o painel administrativo" : "Verificação em Duas Etapas"}</p>
                </div>

                {step === 1 ? (
                    <form onSubmit={handleLogin} className={styles.form}>
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
                ) : (
                    <form onSubmit={handleVerify} className={styles.form}>
                        <div style={{ background: '#f0fdf4', padding: '1rem', borderRadius: '8px', marginBottom: '1rem', color: '#166534', fontSize: '0.9rem' }}>
                            Um código de 5 dígitos foi enviado para seu email seguro.
                        </div>
                        <div className={styles.formGroup}>
                            <label>Código de Verificação</label>
                            <input
                                type="text"
                                value={code}
                                onChange={(e) => setCode(e.target.value)}
                                placeholder="12345"
                                style={{ textAlign: 'center', letterSpacing: '5px', fontSize: '1.2rem' }}
                                maxLength={5}
                                required
                            />
                        </div>
                        <Button type="submit" disabled={loading} style={{ width: '100%' }}>
                            {loading ? "Verificando..." : "Validar Código"}
                        </Button>
                        <button
                            type="button"
                            onClick={() => setStep(1)}
                            style={{ width: '100%', marginTop: '10px', background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', fontSize: '0.9rem' }}
                        >
                            Voltar
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
}

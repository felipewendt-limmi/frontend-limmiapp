"use client";
import React, { useEffect, useState } from 'react';
import { Settings, Shield, Laptop, Tablet, Smartphone, LogOut, Edit2, Check, X, Loader2, ArrowRight } from 'lucide-react';
import styles from './page.module.css';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/components/ui/Toast/ToastProvider';
import Button from '@/components/ui/Button/Button';

export default function AdminSettings() {
    const { getSessions, renameSession, disconnectSession, requestAccountUpdate, verifyAccountUpdate } = useAuth();
    const { addToast } = useToast();

    const [sessions, setSessions] = useState([]);
    const [loadingSessions, setLoadingSessions] = useState(true);
    const [updatingAccount, setUpdatingAccount] = useState(false);
    const [show2FAModal, setShow2FAModal] = useState(false);

    // Form states
    const [newEmail, setNewEmail] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [twoFactorCode, setTwoFactorCode] = useState("");

    // Rename state
    const [editingSessionId, setEditingSessionId] = useState(null);
    const [tempSessionName, setTempSessionName] = useState("");

    useEffect(() => {
        loadSessions();
    }, []);

    const loadSessions = async () => {
        try {
            const res = await getSessions();
            setSessions(res.data);
        } catch (error) {
            addToast("Falha ao carregar sessões.", "error");
        } finally {
            setLoadingSessions(false);
        }
    };

    const handleRename = async (sessionId) => {
        try {
            await renameSession(sessionId, tempSessionName);
            addToast("Dispositivo renomeado.", "success");
            setEditingSessionId(null);
            loadSessions();
        } catch (error) {
            addToast("Erro ao renomear.", "error");
        }
    };

    const handleDisconnect = async (sessionId) => {
        if (!confirm("Tem certeza que deseja desconectar este dispositivo?")) return;
        try {
            await disconnectSession(sessionId);
            addToast("Sessão encerrada.", "success");
            loadSessions();
        } catch (error) {
            addToast("Erro ao desconectar.", "error");
        }
    };

    const handleAccountUpdateSubmit = async (e) => {
        e.preventDefault();
        if (newPassword && newPassword !== confirmPassword) {
            return addToast("As senhas não coincidem.", "error");
        }

        try {
            setUpdatingAccount(true);
            await requestAccountUpdate();
            setShow2FAModal(true);
            addToast("Código enviado para seu email.", "success");
        } catch (error) {
            addToast("Falha ao solicitar código.", "error");
        } finally {
            setUpdatingAccount(false);
        }
    };

    const handleConfirmUpdate = async () => {
        try {
            setUpdatingAccount(true);
            await verifyAccountUpdate({
                code: twoFactorCode,
                email: newEmail || undefined,
                password: newPassword || undefined
            });
            addToast("Conta atualizada com sucesso!", "success");
            setShow2FAModal(false);
            setTwoFactorCode("");
            setNewPassword("");
            setConfirmPassword("");
            setNewEmail("");
        } catch (error) {
            addToast("Código inválido ou erro ao salvar.", "error");
        } finally {
            setUpdatingAccount(false);
        }
    };

    const getDeviceIcon = (ua) => {
        if (!ua) return <Laptop size={20} />;
        const lowUA = ua.toLowerCase();
        if (lowUA.includes('mobi')) return <Smartphone size={20} />;
        if (lowUA.includes('tablet')) return <Tablet size={20} />;
        return <Laptop size={20} />;
    };

    const parseShortUA = (ua) => {
        if (!ua) return "Navegador";
        if (ua.includes('Chrome')) return 'Chrome';
        if (ua.includes('Safari') && !ua.includes('Chrome')) return 'Safari';
        if (ua.includes('Firefox')) return 'Firefox';
        if (ua.includes('Edge')) return 'Edge';
        return "Navegador";
    };

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <h1 className={styles.title}>Configurações</h1>
                <p style={{ color: '#64748b' }}>Gerencie sua conta e sessões ativas.</p>
            </header>

            <section className={styles.section}>
                <h2 className={styles.sectionTitle}><Shield size={20} /> Segurança da Conta</h2>
                <form className={styles.formGrid} onSubmit={handleAccountUpdateSubmit}>
                    <div className={styles.inputGroup}>
                        <label>Novo Email (deixe em branco para manter)</label>
                        <input
                            type="email"
                            className={styles.input}
                            placeholder="novo@email.com"
                            value={newEmail}
                            onChange={e => setNewEmail(e.target.value)}
                        />
                    </div>
                    <div></div> {/* Spacer */}
                    <div className={styles.inputGroup}>
                        <label>Nova Senha</label>
                        <input
                            type="password"
                            className={styles.input}
                            placeholder="••••••••"
                            value={newPassword}
                            onChange={e => setNewPassword(e.target.value)}
                        />
                    </div>
                    <div className={styles.inputGroup}>
                        <label>Confirmar Nova Senha</label>
                        <input
                            type="password"
                            className={styles.input}
                            placeholder="••••••••"
                            value={confirmPassword}
                            onChange={e => setConfirmPassword(e.target.value)}
                        />
                    </div>
                    <div style={{ gridColumn: 'span 2' }}>
                        <Button type="submit" isLoading={updatingAccount}>Salvar Alterações</Button>
                    </div>
                </form>
            </section>

            <section className={styles.section}>
                <h2 className={styles.sectionTitle}><LogOut size={20} /> Dispositivos Conectados</h2>
                <div className={styles.sessionList}>
                    {loadingSessions ? (
                        <p>Carregando sessões...</p>
                    ) : sessions.map(session => (
                        <div key={session.id} className={styles.sessionCard}>
                            <div className={styles.sessionInfo}>
                                <div className={styles.sessionIcon}>
                                    {getDeviceIcon(session.deviceName)}
                                </div>
                                <div className={styles.sessionDetails}>
                                    {editingSessionId === session.id ? (
                                        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                                            <input
                                                autoFocus
                                                className={styles.input}
                                                style={{ padding: '0.2rem 0.5rem' }}
                                                value={tempSessionName}
                                                onChange={e => setTempSessionName(e.target.value)}
                                            />
                                            <button className={styles.renameBtn} onClick={() => handleRename(session.id)}><Check size={16} /></button>
                                            <button className={styles.renameBtn} onClick={() => setEditingSessionId(null)}><X size={16} /></button>
                                        </div>
                                    ) : (
                                        <h4>
                                            {session.deviceName?.includes('/') ? parseShortUA(session.deviceName) : (session.deviceName || "Dispositivo")}
                                            {session.token === localStorage.getItem('token') && <span className={styles.currentBadge}>Este dispositivo</span>}
                                        </h4>
                                    )}
                                    <p>{session.ip} • Last seen: {new Date(session.lastSeen).toLocaleString('pt-BR')}</p>
                                </div>
                            </div>
                            <div className={styles.sessionActions}>
                                {!editingSessionId && (
                                    <button
                                        className={styles.renameBtn}
                                        onClick={() => {
                                            setEditingSessionId(session.id);
                                            setTempSessionName(session.deviceName || "");
                                        }}
                                    >
                                        <Edit2 size={16} />
                                    </button>
                                )}
                                <button className={styles.disconnectBtn} onClick={() => handleDisconnect(session.id)}>
                                    Desconectar
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {show2FAModal && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modal}>
                        <h3 style={{ marginBottom: '1rem', fontWeight: '700' }}>Confirmar Alteração</h3>
                        <p style={{ fontSize: '0.9rem', color: '#64748b', marginBottom: '1.5rem' }}>
                            Por segurança, digite o código de 5 dígitos enviado para seu email.
                        </p>
                        <input
                            type="text"
                            maxLength={5}
                            className={styles.input}
                            style={{ width: '100%', textAlign: 'center', fontSize: '1.5rem', tracking: '0.5em', marginBottom: '1.5rem' }}
                            value={twoFactorCode}
                            onChange={e => setTwoFactorCode(e.target.value)}
                        />
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <Button
                                variant="secondary"
                                style={{ flex: 1 }}
                                onClick={() => setShow2FAModal(false)}
                            >
                                Cancelar
                            </Button>
                            <Button
                                style={{ flex: 1 }}
                                isLoading={updatingAccount}
                                onClick={handleConfirmUpdate}
                            >
                                Confirmar
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

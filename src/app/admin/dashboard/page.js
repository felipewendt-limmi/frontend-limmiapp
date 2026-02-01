"use client";
import React, { useEffect, useState } from 'react';
import { LayoutDashboard, Package, ShoppingBag, Users, Settings, TrendingUp, RefreshCcw, AlertOctagon } from 'lucide-react';
import styles from './page.module.css';
import { useData } from '@/context/DataContext';
import { useToast } from '@/components/ui/Toast/ToastProvider';
import Button from '@/components/ui/Button/Button';

export default function AdminDashboard() {
    const { getDashboardStats, resetDatabase } = useData();
    const { addToast } = useToast();
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isResetting, setIsResetting] = useState(false);

    const loadStats = async () => {
        try {
            const data = await getDashboardStats();
            setStats(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadStats();
    }, [getDashboardStats]);

    const handleResetDatabase = async () => {
        const confirm1 = window.confirm("ATENÇÃO: Isso apagará TODOS os dados do sistema (lojas, produtos, relatórios) e restaurará o estado de fábrica. Deseja continuar?");
        if (!confirm1) return;

        const confirm2 = window.prompt("Para confirmar o reset total, digite 'RESETAR' abaixo:");
        if (confirm2 !== 'RESETAR') {
            addToast("Confirmação inválida. Reset cancelado.", "info");
            return;
        }

        setIsResetting(true);
        try {
            await resetDatabase();
            addToast("Banco de dados resetado com sucesso!", "success");
            // Reload page to reflect changes
            window.location.reload();
        } catch (error) {
            addToast("Erro ao resetar banco de dados.", "error");
            console.error(error);
        } finally {
            setIsResetting(false);
        }
    };

    if (loading) return <div style={{ padding: '2rem' }}>Carregando estatísticas...</div>;
    if (!stats) return <div style={{ padding: '2rem' }}>Erro ao carregar dados.</div>;

    return (
        <>
            <header className={styles.header}>
                <div>
                    <h1 className={styles.title}>Visão Geral</h1>
                    <p style={{ color: '#64748b' }}>Bem-vindo de volta, Admin.</p>
                </div>
            </header>

            <div className={styles.grid}>
                <div className={styles.statCard}>
                    <div className={styles.statHeader}>
                        <div className={styles.statLabel}>Lojas Ativas</div>
                        <div className={styles.statBadge}>
                            Total: {stats.global.clients.total}
                        </div>
                    </div>
                    <div className={styles.statValue}>{stats.global.clients.active}</div>
                </div>

                <div className={styles.statCard}>
                    <div className={styles.statHeader}>
                        <div className={styles.statLabel}>Produtos Totais</div>
                        <div className={styles.statBadge} style={{ background: '#ecfdf5', color: '#059669' }}>
                            Ativos: {stats.global.products.active}
                        </div>
                    </div>
                    <div className={styles.statValue}>{stats.global.products.total}</div>
                </div>

                <div className={styles.statCard}>
                    <div className={styles.statHeader}>
                        <div className={styles.statLabel}>Engajamento Total</div>
                        <div className={styles.statBadge}>
                            Favoritos: {stats.global.engagement.favorites}
                        </div>
                    </div>
                    <div className={styles.statValue}>{stats.global.engagement.views.toLocaleString('pt-BR')} <span style={{ fontSize: '0.8rem', color: '#64748b' }}>views</span></div>
                </div>
            </div>

            <section className={styles.section}>
                <h2 className={styles.sectionTitle}>Desempenho por Loja</h2>
                {stats.clients && stats.clients.length > 0 ? (
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>Loja</th>
                                <th>Produtos</th>
                                <th>Categorias</th>
                                <th>Visualizações</th>
                                <th>Favoritos</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {stats.clients.map((client) => (
                                <tr key={client.id}>
                                    <td>
                                        <div style={{ fontWeight: '600', color: '#1e293b' }}>{client.name}</div>
                                        <div style={{ fontSize: '0.8rem', color: '#64748b' }}>/{client.slug}</div>
                                    </td>
                                    <td>{client.stats.products}</td>
                                    <td>{client.stats.categories}</td>
                                    <td>{client.stats.views.toLocaleString('pt-BR')}</td>
                                    <td>{client.stats.favorites}</td>
                                    <td>
                                        <span style={{
                                            background: client.isActive ? '#dcfce7' : '#fee2e2',
                                            color: client.isActive ? '#166534' : '#991b1b',
                                            padding: '4px 8px',
                                            borderRadius: '12px',
                                            fontSize: '0.8rem',
                                            fontWeight: '600'
                                        }}>
                                            {client.isActive ? 'Ativo' : 'Inativo'}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p>Nenhuma loja encontrada.</p>
                )}
            </section>

            <section className={styles.section} style={{ marginTop: '3rem', borderTop: '1px solid #e2e8f0', paddingTop: '2rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                    <AlertOctagon size={24} color="#ef4444" />
                    <h2 className={styles.sectionTitle} style={{ margin: 0 }}>Zona de Perigo</h2>
                </div>
                <div style={{
                    background: '#fff1f2',
                    border: '1px solid #fecdd3',
                    borderRadius: '8px',
                    padding: '1.5rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '1rem'
                }}>
                    <div>
                        <h3 style={{ fontSize: '1.1rem', fontWeight: '600', color: '#991b1b', marginBottom: '0.25rem' }}>Resetar Banco de Dados</h3>
                        <p style={{ color: '#be123c', fontSize: '0.9rem', maxWidth: '500px' }}>
                            Esta ação apagará permanentemente todos os clientes, produtos, arquivos e logs de interação.
                            O sistema voltará ao estado original com apenas o Catálogo Global e seu usuário Admin.
                        </p>
                    </div>
                    <Button
                        variant="danger"
                        icon={isResetting ? null : RefreshCcw}
                        onClick={handleResetDatabase}
                        disabled={isResetting}
                    >
                        {isResetting ? "Resetando..." : "Resetar Sistema Agora"}
                    </Button>
                </div>
            </section>
        </>
    );
}

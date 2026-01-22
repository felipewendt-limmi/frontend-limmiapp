"use client";
import React, { useEffect, useState } from 'react';
import { LayoutDashboard, Package, ShoppingBag, Users, Settings, TrendingUp } from 'lucide-react';
import styles from './page.module.css';
import { useData } from '@/context/DataContext';

export default function AdminDashboard() {
    const { getDashboardStats } = useData();
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
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
        loadStats();
    }, [getDashboardStats]);

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
        </>
    );
}

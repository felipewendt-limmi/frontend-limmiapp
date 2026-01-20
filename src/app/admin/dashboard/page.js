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
                        <div className={styles.statLabel}>Clientes Totais</div>
                        <div className={styles.statBadge}>
                            Ativos: {stats.clients.active}
                        </div>
                    </div>
                    <div className={styles.statValue}>{stats.clients.total}</div>
                </div>

                <div className={styles.statCard}>
                    <div className={styles.statHeader}>
                        <div className={styles.statLabel}>Produtos Totais</div>
                        <div className={styles.statBadge} style={{ background: '#ecfdf5', color: '#059669' }}>
                            Ativos: {stats.products.active}
                        </div>
                    </div>
                    <div className={styles.statValue}>{stats.products.total}</div>
                </div>

                <div className={styles.statCard}>
                    <div className={styles.statHeader}>
                        <div className={styles.statLabel}>Receita (Simulada)</div>
                        <div className={styles.statBadge}>
                            +12.5% <TrendingUp size={14} />
                        </div>
                    </div>
                    <div className={styles.statValue}>R$ {stats.sales.revenue.toLocaleString('pt-BR')}</div>
                </div>
            </div>

            <section className={styles.section}>
                <h2 className={styles.sectionTitle}>Clientes Recentes</h2>
                {stats.clients.recent && stats.clients.recent.length > 0 ? (
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>Nome</th>
                                <th>Slug</th>
                                <th>Status</th>
                                <th>Data de Cadastro</th>
                            </tr>
                        </thead>
                        <tbody>
                            {stats.clients.recent.map((client) => (
                                <tr key={client.id}>
                                    <td style={{ fontWeight: '500' }}>{client.name}</td>
                                    <td style={{ color: '#64748b' }}>/{client.slug}</td>
                                    <td>
                                        <span style={{
                                            background: client.isActive ? '#dcfce7' : '#fee2e2',
                                            color: client.isActive ? '#166534' : '#991b1b',
                                            padding: '4px 8px',
                                            borderRadius: '12px',
                                            fontSize: '0.85rem',
                                            fontWeight: '600'
                                        }}>
                                            {client.isActive ? 'Ativo' : 'Inativo'}
                                        </span>
                                    </td>
                                    <td>{new Date(client.createdAt).toLocaleDateString('pt-BR')}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p>Nenhum cliente recente.</p>
                )}
            </section>
        </>
    );
}

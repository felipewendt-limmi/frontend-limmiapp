"use client";
import React from 'react';
import { LayoutDashboard, Package, ShoppingBag, Users, Settings, TrendingUp } from 'lucide-react';
import styles from './page.module.css';
import { useData } from '@/context/DataContext';

export default function AdminDashboard() {
    // Determine stats from contexts
    const { clients } = useData();

    // Aggregate data
    const totalProducts = clients.reduce((acc, cli) => acc + (cli.products ? cli.products.length : 0), 0);
    const allOrders = clients.reduce((acc, cli) => [...acc, ...(cli.orders || [])], []);

    const getStatusClass = (status) => {
        switch (status) {
            case 'Entregue': return styles.statusEntregue;
            case 'Cancelado': return styles.statusCancelado;
            default: return styles.statusPendente;
        }
    };

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
                        <div className={styles.statLabel}>Vendas Totais (Mock)</div>
                        <div className={styles.statBadge}>
                            +12.5% <TrendingUp size={14} />
                        </div>
                    </div>
                    <div className={styles.statValue}>R$ 12.450</div>
                </div>
                <div className={styles.statCard}>
                    <div className={styles.statLabel}>Pedidos Ativos</div>
                    <div className={styles.statValue}>{allOrders.filter(o => o.status === 'Pendente').length}</div>
                </div>
                <div className={styles.statCard}>
                    <div className={styles.statLabel}>Produtos Totais</div>
                    <div className={styles.statValue}>{totalProducts}</div>
                </div>
                <div className={styles.statCard}>
                    <div className={styles.statLabel}>Clientes</div>
                    <div className={styles.statValue}>{clients.length}</div>
                </div>
            </div>

            <section className={styles.section}>
                <h2 className={styles.sectionTitle}>Últimos Pedidos</h2>
                {allOrders && allOrders.length > 0 ? (
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Cliente</th>
                                <th>Data</th>
                                <th>Itens</th>
                                <th>Total</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {allOrders.map((order) => (
                                <tr key={order.id}>
                                    <td>{order.id}</td>
                                    <td>{order.customer}</td>
                                    <td>{order.date}</td>
                                    <td>{order.items.map(i => `${i.quantity}x ${i.name}`).join(', ')}</td>
                                    <td style={{ fontWeight: '600' }}>{order.total}</td>
                                    <td>
                                        <span className={getStatusClass(order.status)}>
                                            {order.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p>Nenhum pedido recente.</p>
                )}
            </section>
        </>
    );
}

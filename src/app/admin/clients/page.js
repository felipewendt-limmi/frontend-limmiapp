"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { useData } from '@/context/DataContext';
import Button from '@/components/ui/Button/Button';
import { Plus, Store, MoreVertical, ExternalLink } from 'lucide-react';
import styles from './page.module.css';
import { useToast } from '@/components/ui/Toast/ToastProvider';

export default function AdminClients() {
    const { clients, addClient, toggleClientStatus } = useData();
    const { addToast } = useToast();
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [newClientName, setNewClientName] = useState("");
    const [newClientSlug, setNewClientSlug] = useState("");

    const handleCreateClient = async (e) => {
        e.preventDefault();
        if (!newClientName || !newClientSlug) return;

        try {
            await addClient({
                name: newClientName,
                slug: newClientSlug,
                description: "Nova loja criada",
            });

            setIsModalOpen(false);
            setNewClientName("");
            setNewClientSlug("");
            addToast("Cliente criado com sucesso!", "success");
        } catch (error) {
            addToast("Erro ao criar cliente.", "error");
        }
    };

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <div>
                    <h1 className={styles.title}>Gestão de Clientes</h1>
                    <p style={{ color: '#64748b' }}>Gerencie as lojas cadastradas na plataforma.</p>
                </div>
                <Button icon={Plus} onClick={() => setIsModalOpen(true)}>
                    Novo Cliente
                </Button>
            </header>

            <div className={styles.grid}>
                {clients.map(client => (
                    <div key={client.id} className={styles.card}>
                        <div className={styles.cardHeader}>
                            <div className={styles.iconWrapper}>
                                <Store size={24} color="#1e40af" />
                            </div>
                            <div className={styles.menu}>
                                <span className={`${styles.statusBadge} ${client.isActive ? styles.active : styles.inactive}`}>
                                    {client.isActive ? "Ativo" : "Inativo"}
                                </span>
                            </div>
                        </div>
                        <h3 className={styles.clientName}>{client.name}</h3>
                        <p className={styles.clientSlug}>/{client.slug}</p>
                        <p className={styles.stats}>
                            {(client.products || []).length} Produtos • {(client.orders || []).length} Pedidos
                        </p>
                        <div style={{ marginTop: '0.5rem' }}>
                            <a href={`/${client.slug}`} target="_blank" className={styles.externalLink} style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.85rem', color: '#64748b', textDecoration: 'none' }}>
                                <ExternalLink size={14} /> Ver Loja
                            </a>
                        </div>

                        <div className={styles.cardActions}>
                            <Link href={`/admin/clients/${client.slug}`} style={{ width: '100%' }}>
                                <Button variant="ghost" style={{ width: '100%', border: '1px solid #e2e8f0' }}>
                                    Gerenciar Loja
                                </Button>
                            </Link>
                        </div>
                    </div>
                ))}
            </div>

            {/* Simple Modal for Demo */}
            {isModalOpen && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modal}>
                        <h2>Criar Novo Cliente</h2>
                        <form onSubmit={handleCreateClient}>
                            <div className={styles.formGroup}>
                                <label>Nome da Loja</label>
                                <input
                                    type="text"
                                    value={newClientName}
                                    onChange={(e) => {
                                        setNewClientName(e.target.value);
                                        setNewClientSlug(e.target.value.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, ''));
                                    }}
                                    placeholder="Ex: Empório da Maria"
                                    required
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label>Slug (URL)</label>
                                <input
                                    type="text"
                                    value={newClientSlug}
                                    onChange={(e) => setNewClientSlug(e.target.value)}
                                    placeholder="ex: emporio-da-maria"
                                    required
                                />
                            </div>
                            <div className={styles.modalActions}>
                                <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>Cancelar</Button>
                                <Button type="submit">Criar Loja</Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

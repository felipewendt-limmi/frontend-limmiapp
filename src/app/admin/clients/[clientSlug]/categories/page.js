"use client";
import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useData } from '@/context/DataContext';
import Button from '@/components/ui/Button/Button';
import { ArrowLeft, Save, RefreshCw, Smartphone } from 'lucide-react';
import { useToast } from '@/components/ui/Toast/ToastProvider';
import styles from './page.module.css';

export default function CategoryManagement() {
    const params = useParams();
    const router = useRouter();
    const { getClientBySlug, getClientCategories, updateCategory, syncCategories, isLoaded } = useData();
    const { addToast } = useToast();

    const [client, setClient] = useState(null);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [syncing, setSyncing] = useState(false);

    useEffect(() => {
        if (isLoaded && params?.clientSlug) {
            const found = getClientBySlug(params.clientSlug);
            setClient(found);
            if (found) {
                fetchCategories(found.id);
            }
        }
    }, [isLoaded, params, getClientBySlug]);

    const fetchCategories = async (clientId) => {
        try {
            setLoading(true);
            const data = await getClientCategories(clientId);
            setCategories(data);
        } catch (error) {
            console.error(error);
            addToast("Erro ao carregar categorias.", "error");
        } finally {
            setLoading(false);
        }
    };

    const handleSync = async () => {
        if (!client) return;
        setSyncing(true);
        try {
            const res = await syncCategories(client.id);
            addToast(`Sincronização concluída! ${res.created} categorias criadas.`, "success");
            fetchCategories(client.id);
        } catch (error) {
            addToast("Erro ao sincronizar categorias.", "error");
        } finally {
            setSyncing(false);
        }
    };

    const handleEmojiChange = (id, emoji) => {
        setCategories(prev => prev.map(c => c.id === id ? { ...c, emoji } : c));
    };

    const handleSave = async (category) => {
        try {
            await updateCategory(category.id, { emoji: category.emoji });
            addToast("Emoji atualizado!", "success");
        } catch (error) {
            addToast("Erro ao salvar emoji.", "error");
        }
    };

    if (!isLoaded || !client) return <div className={styles.loading}>Carregando...</div>;

    return (
        <div className={styles.container}>
            <div className={styles.topBar}>
                <Link href={`/admin/clients/${client.slug}`} className={styles.backLink}>
                    <ArrowLeft size={16} /> Voltar para Loja
                </Link>
            </div>

            <header className={styles.header}>
                <div>
                    <h1 className={styles.title}>Categorias: {client.name}</h1>
                    <p className={styles.subtitle}>Gerencie os emojis e a ordem das categorias.</p>
                </div>
                <Button onClick={handleSync} disabled={syncing} variant="secondary" icon={RefreshCw}>
                    {syncing ? "Sincronizando..." : "Sincronizar com Produtos"}
                </Button>
            </header>

            <div className={styles.grid}>
                {categories.map(cat => (
                    <div key={cat.id} className={styles.card}>
                        <div className={styles.cardHeader}>
                            <h3 className={styles.catName}>{cat.name}</h3>
                            <span className={styles.badge}>{cat.productsCount || 0} produtos</span>
                        </div>

                        <div className={styles.inputGroup}>
                            <label>Emoji</label>
                            <div className={styles.inputWrapper}>
                                <input
                                    type="text"
                                    value={cat.emoji || ''}
                                    onChange={e => handleEmojiChange(cat.id, e.target.value)}
                                    placeholder="Ex: 🍎"
                                    className={styles.input}
                                />
                                <Button
                                    size="sm"
                                    onClick={() => handleSave(cat)}
                                    icon={Save}
                                >
                                    Salvar
                                </Button>
                            </div>
                        </div>
                    </div>
                ))}

                {categories.length === 0 && !loading && (
                    <div className={styles.empty}>
                        Nenhuma categoria encontrada. Clique em "Sincronizar" para buscar dos produtos cadastrados.
                    </div>
                )}
            </div>
        </div>
    );
}

// Helper Link component since next/link is constrained in imports sometimes
function Link({ href, children, className }) {
    const router = useRouter();
    return (
        <a
            href={href}
            onClick={(e) => { e.preventDefault(); router.push(href); }}
            className={className}
        >
            {children}
        </a>
    );
}

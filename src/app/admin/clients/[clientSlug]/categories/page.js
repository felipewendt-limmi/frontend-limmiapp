"use client";
import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useData } from '@/context/DataContext';
import { useToast } from '@/components/ui/Toast/ToastProvider';
import { RefreshCw, Save } from 'lucide-react';
import Button from '@/components/ui/Button/Button';

export default function CategoriesPage() {
    const params = useParams();
    const { getClientCategories, updateCategory, syncCategories } = useData();
    const { addToast } = useToast();
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [syncing, setSyncing] = useState(false);
    const [saving, setSaving] = useState(null); // ID of category being saved

    useEffect(() => {
        loadCategories();
    }, [params.clientSlug]); // Assuming we can get clientId from context or need to look it up

    // Wait... params.clientSlug is a SLUG. We need the ID.
    // The layout usually provides the Client context or we fetch it.
    // Let's use useData to find the client.
    const { getClientBySlug } = useData();
    const client = getClientBySlug(params.clientSlug);

    const loadCategories = async () => {
        if (!client) return;
        setLoading(true);
        try {
            const data = await getClientCategories(client.id);
            setCategories(data);
        } catch (error) {
            addToast('Erro ao carregar categorias', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleSync = async () => {
        if (!client) return;
        setSyncing(true);
        try {
            const res = await syncCategories(client.id);
            addToast(`Sincronização completa! ${res.created} novas categorias.`, 'success');
            loadCategories();
        } catch (error) {
            addToast('Erro ao sincronizar', 'error');
        } finally {
            setSyncing(false);
        }
    };

    const handleEmojiChange = (id, newEmoji) => {
        setCategories(prev => prev.map(c => c.id === id ? { ...c, emoji: newEmoji } : c));
    };

    const handleSave = async (category) => {
        setSaving(category.id);
        try {
            await updateCategory(category.id, { emoji: category.emoji });
            addToast('Categoria atualizada!', 'success');
        } catch (error) {
            addToast('Erro ao salvar', 'error');
        } finally {
            setSaving(null);
        }
    };

    // If client is not loaded yet
    if (!client) return <div style={{ padding: '2rem' }}>Carregando cliente...</div>;

    return (
        <div style={{ padding: '2rem', maxWidth: '800px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <h1 style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#1e293b' }}>Categorias & Emojis</h1>
                    <p style={{ color: '#64748b' }}>Defina os ícones que aparecerão no topo da loja.</p>
                </div>
                <Button variant="secondary" onClick={handleSync} disabled={syncing} icon={RefreshCw}>
                    {syncing ? 'Sincronizando...' : 'Sincronizar dos Produtos'}
                </Button>
            </div>

            {loading ? (
                <p>Carregando...</p>
            ) : categories.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '3rem', background: '#f8fafc', borderRadius: '12px' }}>
                    <p>Nenhuma categoria encontrada. Clique em Sincronizar para buscar dos produtos cadastrados.</p>
                </div>
            ) : (
                <div style={{ display: 'grid', gap: '1rem' }}>
                    {categories.map(cat => (
                        <div key={cat.id} style={{
                            display: 'flex',
                            alignItems: 'center',
                            background: 'white',
                            padding: '1rem',
                            borderRadius: '8px',
                            border: '1px solid #e2e8f0',
                            justifyContent: 'space-between'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <div style={{
                                    width: '50px',
                                    height: '50px',
                                    background: '#f1f5f9',
                                    borderRadius: '8px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '1.5rem'
                                }}>
                                    {cat.emoji || '❓'}
                                </div>
                                <span style={{ fontWeight: '600', fontSize: '1.1rem' }}>{cat.name}</span>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <input
                                    type="text"
                                    value={cat.emoji || ''}
                                    onChange={(e) => handleEmojiChange(cat.id, e.target.value)}
                                    placeholder="Emoji"
                                    maxLength={2}
                                    style={{
                                        width: '60px',
                                        padding: '0.5rem',
                                        textAlign: 'center',
                                        fontSize: '1.2rem',
                                        borderRadius: '6px',
                                        border: '1px solid #cbd5e1'
                                    }}
                                />
                                <Button
                                    size="sm"
                                    onClick={() => handleSave(cat)}
                                    disabled={saving === cat.id}
                                    icon={Save}
                                >
                                    {saving === cat.id ? '...' : 'Salvar'}
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

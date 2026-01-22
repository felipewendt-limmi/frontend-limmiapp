"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { useData } from '@/context/DataContext';
import Button from '@/components/ui/Button/Button';
import { Plus, Store, MoreVertical, ExternalLink } from 'lucide-react';
import styles from './page.module.css';
import { useToast } from '@/components/ui/Toast/ToastProvider';

export default function AdminClients() {
    const { clients, addClient, toggleClientStatus, bulkImportClients } = useData();
    const { addToast } = useToast();
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Single Create State
    const [newClientName, setNewClientName] = useState("");
    const [newClientSlug, setNewClientSlug] = useState("");

    // Bulk Import State
    const [importType, setImportType] = useState("clients"); // "clients" or "products"

    const PROMPT_CLIENTS = `Atue como um Arquiteto de Dados e Pesquisador Nutricional. Preciso criar uma estrutura completa de lojas e produtos.
Regras:
1. Gere um ARRAY JSON contendo objetos de CLIENTES.
2. Cada Cliente deve ter um array de PRODUTOS.
3. PESQUISA REAL: Para cada produto, busque na internet a tabela nutricional real (ex: TACO, USDA ou sites de fabricantes).
4. Preencha os campos 'nutrition', 'benefits' e 'helpsWith' com dados REAIS e precisos.
5. Se o usuário fornecer nomes/preços específicos de um Excel, use-os EXATAMENTE.

Estrutura (Schema JSON):
[
  {
    "name": "Nome da Loja",
    "slug": "nome-da-loja-slug",
    "description": "Descrição da loja...",
    "products": [
      {
        "name": "Nome exato",
        "category": "Categoria",
        "price": 0.00,
        "description": "Descrição real...",
        "benefits": ["Benefício real", "..."],
        "helpsWith": ["Auxílio real", "..."],
        "tags": ["Dica de uso", "..."],
        "nutrition": [ { "label": "Calorias", "value": "X kcal" }, ... ]
      }
    ]
  }
]`;

    const PROMPT_PRODUCTS = `Atue como um Especialista em Dados Nutricionais. Preciso transformar uma lista de produtos em um JSON estruturado.
Regras:
1. Gere APENAS um ARRAY JSON de objetos de PRODUTOS.
2. PESQUISA REAL: Busque na internet a tabela nutricional e benefícios REAIS de cada produto.
3. Use EXATAMENTE o nome e preço fornecidos (provindos de Excel).
4. Preencha 'nutrition', 'benefits' e 'helpsWith' com informações verdadeiras.

Estrutura (Schema JSON):
[
  {
    "name": "Nome exato",
    "category": "Categoria",
    "price": 0.00,
    "description": "Destaque propriedades reais do produto...",
    "benefits": ["Benefício real", "..."],
    "helpsWith": ["Auxílio real", "..."],
    "tags": ["Dica de uso", "..."],
    "nutrition": [ { "label": "Proteína", "value": "Xg" }, ... ]
  }
]`;

    const handleCopyPrompt = () => {
        const text = importType === "clients" ? PROMPT_CLIENTS : PROMPT_PRODUCTS;
        navigator.clipboard.writeText(text);
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
    };

    const handleBulkImport = async () => {
        try {
            const parsed = JSON.parse(importJson);
            if (!Array.isArray(parsed)) {
                addToast("O JSON deve ser uma lista (Array).", "error");
                return;
            }
            setImporting(true);

            // Polymorphic detection
            const isProductOnly = parsed.length > 0 && !parsed[0].products && parsed[0].name;

            if (isProductOnly) {
                const globalClient = clients.find(c => c.slug === 'global-catalog');
                if (globalClient) {
                    const { importProducts } = useData.getState ? useData.getState() : { importProducts: null };
                    // fallback to context if getState is not available (which it isn't in standard DataContext)
                    // Let's use the provided importProducts via hook if possible, or just bulkImportClients if it handles it.
                    // Actually, let's just use bulkImportClients and update DataContext to handle both.
                    await bulkImportClients(parsed);
                } else {
                    addToast("Catálogo Global não encontrado.", "error");
                    setImporting(false);
                    return;
                }
            } else {
                await bulkImportClients(parsed);
            }

            addToast(`Importação concluída!`, "success");
            setIsBulkModalOpen(false);
            setImportJson("");
            setImportStep(1);
        } catch (error) {
            addToast("Erro na importação. Verifique o console.", "error");
            console.error(error);
        } finally {
            setImporting(false);
        }
    };

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
                <div className={styles.headerActions}>
                    <Button variant="secondary" onClick={() => setIsBulkModalOpen(true)}>
                        Importar (JSON)
                    </Button>
                    <Button icon={Plus} onClick={() => setIsModalOpen(true)}>
                        Novo Cliente
                    </Button>
                </div>
            </header>

            <div className={styles.grid}>
                {clients.filter(c => c.slug !== 'global-catalog').map(client => (
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

            {/* Simple Modal for Create */}
            {isModalOpen && (
                <div className={styles.modalOverlay} onClick={() => setIsModalOpen(false)}>
                    <div className={styles.modal} onClick={e => e.stopPropagation()}>
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

            {/* Bulk Import Modal */}
            {isBulkModalOpen && (
                <div className={styles.modalOverlay} onClick={() => setIsBulkModalOpen(false)}>
                    <div className={styles.modal} onClick={e => e.stopPropagation()} style={{ maxWidth: '600px' }}>
                        {/* Header with Steps */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <h2 style={{ margin: 0 }}>Importação em Massa</h2>
                            <button onClick={() => setIsBulkModalOpen(false)} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer' }}>&times;</button>
                        </div>

                        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', borderBottom: '1px solid #e2e8f0' }}>
                            <button
                                onClick={() => setImportStep(1)}
                                style={{ padding: '0.5rem', borderBottom: importStep === 1 ? '2px solid #2563eb' : 'none', fontWeight: importStep === 1 ? 'bold' : 'normal', flex: 1 }}
                            >
                                1. Instruções (Prompt)
                            </button>
                            <button
                                onClick={() => setImportStep(2)}
                                style={{ padding: '0.5rem', borderBottom: importStep === 2 ? '2px solid #2563eb' : 'none', fontWeight: importStep === 2 ? 'bold' : 'normal', flex: 1 }}
                            >
                                2. Colar JSON
                            </button>
                        </div>

                        {importStep === 1 ? (
                            <div>
                                <div style={{ display: 'flex', gap: '10px', marginBottom: '1rem' }}>
                                    <button
                                        onClick={() => setImportType("clients")}
                                        style={{ flex: 1, padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0', background: importType === 'clients' ? '#eff6ff' : 'white', fontWeight: importType === 'clients' ? 'bold' : 'normal', color: importType === 'clients' ? '#2563eb' : '#64748b', cursor: 'pointer' }}
                                    >
                                        Lojas + Produtos
                                    </button>
                                    <button
                                        onClick={() => setImportType("products")}
                                        style={{ flex: 1, padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0', background: importType === 'products' ? '#eff6ff' : 'white', fontWeight: importType === 'products' ? 'bold' : 'normal', color: importType === 'products' ? '#2563eb' : '#64748b', cursor: 'pointer' }}
                                    >
                                        Apenas Produtos
                                    </button>
                                </div>
                                <p style={{ marginBottom: '1rem', color: '#64748b', fontSize: '0.9rem' }}>
                                    {importType === 'clients'
                                        ? "Use este prompt para gerar lojas inteiras com seus produtos (Ideal para migração)."
                                        : "Use este prompt para gerar uma lista de produtos avulsos para o Catálogo Global."}
                                </p>
                                <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '8px', border: '1px solid #e2e8f0', marginBottom: '1rem', fontSize: '0.8rem', maxHeight: '200px', overflowY: 'auto', whiteSpace: 'pre-wrap', fontFamily: 'monospace' }}>
                                    {importType === 'clients' ? PROMPT_CLIENTS : PROMPT_PRODUCTS}
                                </div>
                                <Button onClick={handleCopyPrompt} variant="secondary" fullWidth style={{ marginBottom: '1rem' }}>
                                    {copySuccess ? "Copiado!" : "Copiar Prompt"}
                                </Button>
                                <div style={{ textAlign: 'right' }}>
                                    <Button onClick={() => setImportStep(2)}>Ir para Importação &rarr;</Button>
                                </div>
                            </div>
                        ) : (
                            <div>
                                <p style={{ marginBottom: '1rem', color: '#64748b' }}>
                                    Cole o JSON gerado abaixo.
                                </p>
                                <textarea
                                    rows={10}
                                    value={importJson}
                                    onChange={(e) => setImportJson(e.target.value)}
                                    placeholder='[{ "name": "...", ... }]'
                                    style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontFamily: 'monospace', fontSize: '0.85rem' }}
                                />
                                <div className={styles.modalActions} style={{ marginTop: '1rem' }}>
                                    <Button variant="secondary" onClick={() => setIsBulkModalOpen(false)}>Cancelar</Button>
                                    <Button onClick={handleBulkImport} disabled={importing || !importJson}>
                                        {importing ? "Processando..." : "Importar"}
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

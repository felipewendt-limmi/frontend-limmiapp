"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { useData } from '@/context/DataContext';
import Button from '@/components/ui/Button/Button';
import { Plus, Store, MoreVertical, ExternalLink, X, ArrowRight, Check, Upload, Copy } from 'lucide-react';
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
    const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
    const [importStep, setImportStep] = useState(1);
    const [importJson, setImportJson] = useState("");
    const [importing, setImporting] = useState(false);
    const [copySuccess, setCopySuccess] = useState(false);
    const [importType, setImportType] = useState("clients"); // "clients", "products", or "correction"

    const PROMPT_CLIENTS = `Atue como um Engenheiro de Dados. Sua tarefa é cruzar a Base Master e a Lista da Loja para gerar o JSON de importação.

INSTRUÇÕES:
1. PRODUTO EXISTENTE (SLUG/NOME): Se o produto já existe na Base Master, use o "id" correspondente.
2. PREÇOS SEPARADOS:
   - "clientPrice": O preço exato informado na lista da loja (preço final do cliente).
   - "marketPrice": Preço base de mercado (referência global). Utilize valores médios reais por 100g.
3. REGRAS RÍGIDAS:
   - PROIBIDO "N/A": Nunca use "N/A" ou placeholders vazios. Se faltar info nutricional, use médias técnicas reais.
   - ENRIQUECIMENTO: Mesmo que o produto já exista, gere Descrição Rica, 5 Benefícios e 5 Dicas.
   - TAGS: Apenas alimentos reais que combinam (arroz, frango, etc).

ESTRUTURA JSON:
[
  {
    "id": "UUID-DA-BASE-MASTER-SE-HOUVER",
    "name": "Nome do Produto",
    "clientPrice": 10.50,
    "marketPrice": 12.00,
    "category": "Categoria válida",
    "description": "Descrição rica...",
    "benefits": ["...", "...", "...", "...", "..."],
    "helpsWith": ["...", "...", "...", "...", "..."],
    "tags": ["Alimento 1", "Alimento 2"],
    "nutrition": [
      { "label": "Calorias", "value": "X kcal" },
      { "label": "Proteína", "value": "X g" },
      { "label": "Carboidratos", "value": "X g" },
      { "label": "Gordura", "value": "X g" },
      { "label": "Fibra", "value": "X g" }
    ]
  }
]`;

    const PROMPT_PRODUCTS = PROMPT_CLIENTS;

    const RETAIL_EXPERT_PROMPT = `Atue como um especialista em varejo de produtos a granel, com foco em operação, legislação sanitária e experiência do cliente.

Receberá uma lista de produtos.
Sua tarefa é FILTRAR e RETORNAR APENAS os produtos que fazem sentido serem vendidos a granel, com pesagem variável a cada 100g.

Critérios OBRIGATÓRIOS para MANTER o produto:
    - Produto seco, desidratado, em pó, grão, floco, semente, castanha, farinha, açúcar, sal, tempero, erva seca, chá, cereal, leguminosa, fruta seca ou snack seco.
- Produto estável em temperatura ambiente.
- Produto normalmente vendido por peso(100g, 200g, 500g, etc).
- Produto que o cliente espera escolher quantidade(granel).

Critérios OBRIGATÓRIOS para EXCLUIR:
    - Produtos vendidos por unidade(UND, bandeja, maço, espiga, metade).
- Produtos frescos(frutas, verduras, legumes in natura).
- Produtos refrigerados ou congelados.
- Produtos prontos, assados, recheados ou de padaria.
- Carnes, frios, laticínios, embutidos.
- Bebidas líquidas.
- Utensílios, embalagens, decoração, brindes, brinquedos.
- Produtos não alimentícios(máscaras, marcadores, moringas, cestas, lenha, taxas, regulamentos).
- Serviços ou taxas.
- Produtos infantis industrializados com marca fechada.
- Massas frescas, pizzas, salgados, pratos prontos.

Regras de saída:
    - Retorne APENAS a lista final dos produtos válidos.
- Um produto por linha.
- Não categorizar.
- Não explicar.
- Não justificar.
- Não corrigir nomes.
- Não adicionar produtos novos.
- Não remover palavras do nome.
- Apenas copiar exatamente o nome do produto aprovado.

Lista de produtos:
    [COLAR A LISTA COMPLETA AQUI]`;

    const handleCopyPrompt = () => {
        let text = PROMPT_CLIENTS;
        if (importType === "products") text = PROMPT_PRODUCTS;
        if (importType === "correction") text = RETAIL_EXPERT_PROMPT;
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
                                <span className={`${styles.statusBadge} ${client.isActive ? styles.active : styles.inactive} `}>
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
                            <a href={`/ ${client.slug} `} target="_blank" className={styles.externalLink} style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.85rem', color: '#64748b', textDecoration: 'none' }}>
                                <ExternalLink size={14} /> Ver Loja
                            </a>
                        </div>

                        <div className={styles.cardActions}>
                            <Link href={`/ admin / clients / ${client.slug} `} style={{ width: '100%' }}>
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
                    <div className={styles.modal} onClick={e => e.stopPropagation()} style={{ maxWidth: '650px' }}>
                        <div className={styles.modalHeader}>
                            <h2 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Importação em Massa</h2>
                            <button className={styles.closeBtn} onClick={() => setIsBulkModalOpen(false)}><X size={20} /></button>
                        </div>

                        <div className={styles.importSteps}>
                            <div className={`${styles.importStepAlt} ${importStep === 1 ? styles.importStepActiveAlt : ''} `} onClick={() => setImportStep(1)}>1. Instruções (Prompt)</div>
                            <div className={`${styles.importStepAlt} ${importStep === 2 ? styles.importStepActiveAlt : ''} `} onClick={() => setImportStep(2)}>2. Colar JSON</div>
                        </div>

                        {importStep === 1 ? (
                            <div className={styles.promptStep}>
                                <div style={{ display: 'flex', gap: '8px', marginBottom: '1rem' }}>
                                    <button
                                        onClick={() => setImportType("clients")}
                                        style={{
                                            flex: 1, padding: '10px', borderRadius: '8px',
                                            border: importType === 'clients' ? '2px solid #2563eb' : '1px solid #e2e8f0',
                                            background: 'white', color: importType === 'clients' ? '#2563eb' : '#64748b',
                                            fontWeight: 600, cursor: 'pointer', fontSize: '0.85rem'
                                        }}
                                    >
                                        Lojas + Prod.
                                    </button>
                                    <button
                                        onClick={() => setImportType("products")}
                                        style={{
                                            flex: 1, padding: '10px', borderRadius: '8px',
                                            border: importType === 'products' ? '2px solid #2563eb' : '1px solid #e2e8f0',
                                            background: 'white', color: importType === 'products' ? '#2563eb' : '#64748b',
                                            fontWeight: 600, cursor: 'pointer', fontSize: '0.85rem'
                                        }}
                                    >
                                        Apenas Prod.
                                    </button>
                                    <button
                                        onClick={() => setImportType("correction")}
                                        style={{
                                            flex: 1, padding: '10px', borderRadius: '8px',
                                            border: importType === 'correction' ? '2px solid #e11d48' : '1px solid #e2e8f0',
                                            background: 'white', color: importType === 'correction' ? '#e11d48' : '#64748b',
                                            fontWeight: 600, cursor: 'pointer', fontSize: '0.85rem'
                                        }}
                                    >
                                        Correção Lista
                                    </button>
                                </div>
                                <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '1rem' }}>
                                    {importType === 'clients' && "Use este prompt para importar lojas inteiras com seus produtos."}
                                    {importType === 'products' && "Use este prompt para importar produtos para o Catálogo Global."}
                                    {importType === 'correction' && "Use este prompt para filtrar sua lista antes da importação."}
                                </p>
                                <div className={styles.promptBoxAlt}>
                                    <pre>
                                        {importType === "clients" && PROMPT_CLIENTS}
                                        {importType === "products" && PROMPT_PRODUCTS}
                                        {importType === "correction" && RETAIL_EXPERT_PROMPT}
                                    </pre>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.5rem' }}>
                                    <button
                                        className={styles.copyBtnAlt}
                                        onClick={handleCopyPrompt}
                                        style={{ background: '#22c55e', color: 'white' }}
                                    >
                                        {copySuccess ? <><Check size={18} /> Copiado!</> : "Copiar Prompt"}
                                    </button>
                                    <Button onClick={() => setImportStep(2)} icon={ArrowRight}>
                                        Ir para Importação
                                    </Button>
                                </div>
                            </div>
                        ) : (
                            <div className={styles.jsonStep}>
                                <textarea
                                    className={styles.jsonTextarea}
                                    placeholder='[{ "name": "...", "products": [...], ... }]'
                                    value={importJson}
                                    onChange={(e) => setImportJson(e.target.value)}
                                    autoFocus
                                />
                                <div className={styles.modalActions}>
                                    <Button variant="secondary" onClick={() => setImportStep(1)}>Voltar</Button>
                                    <Button
                                        onClick={handleBulkImport}
                                        isLoading={importing}
                                        disabled={!importJson.trim()}
                                        icon={Upload}
                                    >
                                        {importing ? "Processando..." : "Importar Agora"}
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

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
    const [importType, setImportType] = useState("clients"); // "clients" or "products"

    const PROMPT_CLIENTS = `Atue como um Engenheiro de Dados e Analista de Mercado. Sua tarefa é cruzar dois conjuntos de dados (Base Master e Lista da Loja) fornecidos via Excel para gerar o JSON de importação de um cliente no sistema LIMMI.

INSTRUÇÕES DE EXECUÇÃO:

1. LEIA A BASE MASTER: Este arquivo contém os produtos já existentes com as colunas "id" (UUID), "name" e "category".
2. LEIA A LISTA DA LOJA: Este arquivo contém os nomes dos produtos e os preços específicos praticados pelo cliente.

LÓGICA DE CRUZAMENTO:
* Antes de comparar, normalize os nomes dos produtos, removendo acentos, diferenças de maiúsculas/minúsculas, espaços extras e variações simples de plural/singular.
* Se o nome do produto na Lista da Loja existir na Base Master, você DEVE:
* Incluir o campo "id" com o UUID correspondente da Base Master.
* Utilizar a "category" exatamente como definida na Base Master.
* O campo "price" DEVE refletir exatamente o valor numérico presente na planilha da loja, sem qualquer alteração.
* Se o nome NÃO existir na Base Master:
* Gere o objeto SEM o campo "id".
* Atribua uma "category" válida conforme o padrão do sistema.
REGRAS RÍGIDAS DE QUALIDADE:
1. PROIBIDO "N/A": Nunca retorne "N/A", null ou valores vazios. Se dados nutricionais estiverem ausentes, utilize MÉDIAS TÉCNICAS confiáveis (TBCA, TACO ou USDA) para o tipo de produto.
2. PREÇO NÃO ESTIMADO: É terminantemente proibido estimar, recalcular ou ajustar preços. O valor deve ser exatamente o informado pelo cliente.
3. ENRIQUECIMENTO COMPLETO: Todos os produtos devem conter: descrição; exatamente 5 benefícios; exatamente 5 helpsWith; tabela nutricional completa. Mesmo quando o produto já existir na Base Master.
4. DESCRIÇÃO RICA: O campo "description" deve ser informativo e comercial, destacando: origem do alimento; uso culinário comum; propriedades nutricionais reais. O texto deve ser claro, educativo e atrativo.
5. TAGS CULINÁRIAS:O campo "tags" deve conter exclusivamente nomes de ALIMENTOS REAIS que combinam com o produto (ex: arroz, frango, banana, iogurte). É proibido usar características, adjetivos, propriedades nutricionais ou termos técnicos como tags.
6. CATEGORIAS VÁLIDAS: Caso o produto não exista na Base Master, a categoria atribuída DEVE ser uma das categorias padrão do sistema e semanticamente compatível com o produto, sendo proibido criar novas categorias.
ORDEM DETERMINÍSTICA:
Os campos do JSON devem seguir exatamente a ordem definida na estrutura abaixo, sem omissões ou reordenação.
SAÍDA:
Retorne APENAS um array JSON puro, pronto para ser processado pela API, sem comentários ou texto adicional.

ESTRUTURA JSON:
[
  {
    "id": "UUID-DO-ARQUIVO-BASE-SE-HOUVER",
    "name": "Nome do Produto",
    "price": 10.50,
    "category": "Categoria válida",
    "description": "Descrição rica e informativa...",
    "benefits": ["...", "...", "...", "...", "..."],
    "helpsWith": ["...", "...", "...", "...", "..."
],
    "tags": ["Alimento 1", "Alimento 2", "Alimento 3"],
    "nutrition": [
      { "label": "Calorias", "value": "X kcal" },
      { "label": "Proteína", "value": "X g" },
      { "label": "Carboidratos", "value": "X g" },
      { "label": "Gordura", "value": "X g" },
      { "label": "Fibra", "value": "X g" }
    ]
  }
]`;

    const PROMPT_PRODUCTS = `Atue como um Engenheiro Mestre de Dados Nutricionais e Especialista em Bioquímica Alimentar. Sua tarefa é transformar a lista de produtos fornecida em um JSON estruturado de altíssima qualidade para o catágo MASTER do sistema LIMMI.
REGRAS DE OURO (CRITICAL):
1. PROIBIDO "N/A": Nunca retorne "N/A" ou valores vazios para dados nutricionais. Se o dado exato não for encontrado, você DEVE pesquisar e usar a MÉDIA TÉCNICA (baseando-se em tabelas oficiais como TBCA, TACO ou USDA) para o tipo de produto genérico.
2. ENRIQUECIMENTO MÁXIMO: Gere exatamente 5 benefícios reais e 5 dicas de "ajuda com" (helpsWith) por produto. Use termos que destaquem as propriedades de saúde.
3. CATEGORIAS PADRÃO: Utilize APENAS uma destas categorias: Grãos e Cereais, Leguminosas, Frutas Secas, Oleaginosas, Farinhas, Temperos, Adoçantes, Chás, Suplementos.
4. DESCRIÇÃO RICA: A descrição deve ser vendedora e informativa, destacando a origem e as propriedades nutricionais.
5. PREÇO: O campo "price" deve representar o preço médio por 100g do produto, calculado a partir de benchmarking do mercado brasileiro, utilizando como referência empórios, lojas a granel e mercados naturais. A estimativa deve seguir faixas fixas por categoria, sempre escolhendo o valor médio da faixa, evitando variações aleatórias entre execuções.
ESTRUTURA JSON (Schema):
[
  {
    "name": "Nome exato do produto",
    "category": "Uma das categorias padrão",
    "price": 0.00,
    "description": "Texto rico e informativo...",
    "benefits": ["B1", "B2", "B3", "B4", "B5"],
    "helpsWith": ["A1", "A2", "A3", "A4", "A5"],
    "tags": ["Dica 1", "Característica 1"],
    "nutrition": [
      { "label": "Calorias", "value": "X kcal" },
      { "label": "Proteína", "value": "Xg" },
      { "label": "Carboidratos", "value": "Xg" },
      { "label": "Gordura", "value": "Xg" },
      { "label": "Fibra", "value": "Xg" }
    ]
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
                    <div className={styles.modal} onClick={e => e.stopPropagation()} style={{ maxWidth: '650px' }}>
                        <div className={styles.modalHeader}>
                            <h2 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Importação em Massa</h2>
                            <button className={styles.closeBtn} onClick={() => setIsBulkModalOpen(false)}><X size={20} /></button>
                        </div>

                        <div className={styles.importSteps}>
                            <div className={`${styles.importStepAlt} ${importStep === 1 ? styles.importStepActiveAlt : ''}`} onClick={() => setImportStep(1)}>1. Instruções (Prompt)</div>
                            <div className={`${styles.importStepAlt} ${importStep === 2 ? styles.importStepActiveAlt : ''}`} onClick={() => setImportStep(2)}>2. Colar JSON</div>
                        </div>

                        {importStep === 1 ? (
                            <div className={styles.promptStep}>
                                <div style={{ display: 'flex', gap: '10px', marginBottom: '1rem' }}>
                                    <button
                                        onClick={() => setImportType("clients")}
                                        style={{ flex: 1, padding: '12px', borderRadius: '8px', border: importType === 'clients' ? '2px solid #2563eb' : '1px solid #e2e8f0', background: 'white', color: importType === 'clients' ? '#2563eb' : '#cbd5e1', fontWeight: 600, cursor: 'pointer' }}
                                    >
                                        Lojas + Produtos
                                    </button>
                                    <button
                                        onClick={() => setImportType("products")}
                                        style={{ flex: 1, padding: '12px', borderRadius: '8px', border: importType === 'products' ? '2px solid #2563eb' : '1px solid #e2e8f0', background: 'white', color: importType === 'products' ? '#2563eb' : '#cbd5e1', fontWeight: 600, cursor: 'pointer' }}
                                    >
                                        Apenas Produtos
                                    </button>
                                </div>
                                <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                                    {importType === 'clients'
                                        ? "Use este prompt para gerar lojas inteiras com seus produtos (Ideal para migração)."
                                        : "Use este prompt para gerar uma lista de produtos avulsos para o Catálogo Global."}
                                </p>
                                <div className={styles.promptBoxAlt}>
                                    <pre>{importType === "clients" ? PROMPT_CLIENTS : PROMPT_PRODUCTS}</pre>
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

"use client";
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import * as XLSX from 'xlsx';
import { useData } from '@/context/DataContext';
import Button from '@/components/ui/Button/Button';
import { Plus, ArrowLeft, Power, Package, Edit2, ExternalLink, Settings, Save, Download, Upload, Copy, Check, BarChart2, FileText, Trash2, Eye, Paperclip, X, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import styles from './page.module.css';
import { useToast } from '@/components/ui/Toast/ToastProvider';
import InteractionLogModal from '@/components/business/InteractionLogModal/InteractionLogModal';

import EmptyState from '@/components/ui/EmptyState/EmptyState';
import { Database } from 'lucide-react';

export default function AdminClientDetail() {
    const params = useParams();
    const router = useRouter();
    const {
        getClientBySlug, updateClient, toggleClientStatus,
        getProductsByClientId, toggleProductStatus, isLoaded,
        importProducts, searchGlobalProducts,
        uploadFile, getClientFiles, deleteFile, exportGlobalCatalog
    } = useData();
    const { addToast } = useToast();

    const [client, setClient] = useState(null);
    const [products, setProducts] = useState([]);
    const [selectedProductForLogs, setSelectedProductForLogs] = useState(null);

    // Tabs
    const [activeTab, setActiveTab] = useState('products'); // 'products', 'reports', 'files', 'settings'

    // Settings State
    const [description, setDescription] = useState("");
    const [coverImages, setCoverImages] = useState([]);
    const [storeLogo, setStoreLogo] = useState("");
    const [saving, setSaving] = useState(false);

    // Files State
    const [files, setFiles] = useState([]);
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef(null);

    // Import Modal State
    const [importModalOpen, setImportModalOpen] = useState(false);
    const [newProductOptionModalOpen, setNewProductOptionModalOpen] = useState(false);
    const [importStep, setImportStep] = useState(1);
    const [importJson, setImportJson] = useState("");
    const [importing, setImporting] = useState(false);
    const [copySuccess, setCopySuccess] = useState(false);

    // Global Catalog State
    const [globalCatalogOpen, setGlobalCatalogOpen] = useState(false);
    const [globalSearchQuery, setGlobalSearchQuery] = useState("");
    const [globalProducts, setGlobalProducts] = useState([]);
    const [selectedGlobalProducts, setSelectedGlobalProducts] = useState([]);
    const [loadingGlobal, setLoadingGlobal] = useState(false);
    const [cloning, setCloning] = useState(false);

    // Initial Load
    useEffect(() => {
        if (isLoaded && params?.clientSlug) {
            const found = getClientBySlug(params.clientSlug);
            setClient(found);
            if (found) {
                setDescription(found.description || "");
                setCoverImages(found.coverImage ? [found.coverImage] : []);
                setStoreLogo(found.logo || "");
                setProducts(getProductsByClientId(found.id));
            }
        }
    }, [isLoaded, params, getClientBySlug, getProductsByClientId]);

    // Load Files when tab active
    useEffect(() => {
        if (activeTab === 'files' && client) {
            loadFiles();
        }
    }, [activeTab, client]);

    const loadFiles = async () => {
        if (!client) return;
        const result = await getClientFiles(client.id);
        setFiles(result);
    };

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploading(true);
        try {
            await uploadFile(client.id, file);
            addToast("Arquivo enviado com sucesso!", "success");
            loadFiles();
        } catch (error) {
            addToast("Erro ao enviar arquivo.", "error");
        } finally {
            setUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = "";
        }
    };

    const handleDeleteFile = async (fileId) => {
        if (!confirm("Tem certeza que deseja excluir este arquivo?")) return;
        try {
            await deleteFile(fileId);
            addToast("Arquivo excluído.", "success");
            loadFiles(); // Refresh
        } catch (error) {
            addToast("Erro ao excluir arquivo.", "error");
        }
    };

    // Debounce Search Global
    useEffect(() => {
        if (!globalCatalogOpen) return;
        const timer = setTimeout(async () => {
            setLoadingGlobal(true);
            try {
                const results = await searchGlobalProducts(globalSearchQuery);
                setGlobalProducts(results);
            } catch (error) {
                console.error(error);
            } finally {
                setLoadingGlobal(false);
            }
        }, 500);
        return () => clearTimeout(timer);
    }, [globalCatalogOpen, globalSearchQuery, searchGlobalProducts]);

    // Actions
    const handleSaveSettings = async () => {
        setSaving(true);
        try {
            await updateClient(client.id, {
                description,
                coverImage: coverImages[0] || "",
                logo: storeLogo
            });
            addToast("Configurações salvas com sucesso!", "success");
        } catch (error) {
            addToast("Erro ao salvar configurações.", "error");
        } finally {
            setSaving(false);
        }
    };

    const handleExportProducts = () => {
        if (!products.length) return;

        // Specific logic for Global Catalog: only Name and Category
        const isGlobal = client.slug === 'global-catalog';

        const data = products.map(product => {
            if (isGlobal) {
                return {
                    "Produto": product.name,
                    "Categoria": product.category || ""
                };
            }
            return {
                "Produto": product.name,
                "Categoria": product.category || "",
                "Preço": product.price || "Consulte",
                "URL": `${window.location.origin.replace('admin.', '')}/${client.slug}/${product.slug}`
            };
        });

        const ws = XLSX.utils.json_to_sheet(data);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Produtos");
        XLSX.writeFile(wb, `${client.slug}_produtos.xlsx`);
    };

    const handleToggleStatus = () => {
        toggleClientStatus(client.id);
        addToast(`Loja ${client.isActive ? 'desativada' : 'ativada'} com sucesso.`, "info");
    };

    const FULL_PROMPT_TEXT = `Atue como um Engenheiro de Dados. Sua tarefa é cruzar a Base Master e a Lista da Loja para gerar o JSON de importação.

INSTRUÇÕES:
1. PRODUTO EXISTENTE (SLUG/NOME): Se o produto já existe na Base Master, use o "id" correspondente.
2. PREÇOS SEPARADOS:
   - "clientPrice": O preço exato informado na lista da loja (preço final do cliente).
   - "marketPrice": Se houver um novo preço sugerido para o mercado global, informe aqui. Caso contrário, repita o preço da loja ou deixe o valor de mercado atual.
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

    const handleCopyPrompt = () => {
        const text = FULL_PROMPT_TEXT;
        navigator.clipboard.writeText(text);
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
    };

    const handleImport = async () => {
        try {
            const parsed = JSON.parse(importJson);
            if (!Array.isArray(parsed)) {
                addToast("O JSON deve ser uma lista (Array) de produtos.", "error");
                return;
            }
            setImporting(true);
            await importProducts(client.id, parsed);
            addToast(`${parsed.length} produtos importados com sucesso!`, "success");
            setImportModalOpen(false);
            setImportJson("");
            setImportStep(1);
        } catch (error) {
            addToast("Erro ao importar. Verifique o JSON.", "error");
        } finally {
            setImporting(false);
        }
    };

    const handleBulkClone = async () => {
        if (selectedGlobalProducts.length === 0) return;
        setCloning(true);
        try {
            const toImport = selectedGlobalProducts.map(p => ({
                name: p.name,
                description: p.description,
                price: p.price,
                category: p.category,
                image: p.image,
                nutrition: p.nutrition,
                benefits: p.benefits,
                tags: p.tags,
                helpsWith: p.helpsWith
            }));
            await importProducts(client.id, toImport);
            addToast(`${toImport.length} produtos clonados com sucesso!`, "success");
            setGlobalCatalogOpen(false);
            setSelectedGlobalProducts([]);
        } catch (error) {
            addToast("Erro ao clonar produtos.", "error");
        } finally {
            setCloning(false);
        }
    };

    const handleExportGlobalBase = async () => {
        try {
            const data = await exportGlobalCatalog();
            const ws = XLSX.utils.json_to_sheet(data);
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, "Base Global");
            XLSX.writeFile(wb, `base_global_limmi_${new Date().toISOString().split('T')[0]}.xlsx`);
            addToast("Base Global exportada com sucesso!", "success");
        } catch (error) {
            addToast("Erro ao exportar base global.", "error");
        }
    };

    if (!isLoaded) return <div className={styles.loading}>Carregando dados...</div>;

    if (!client) {
        if (params.clientSlug === 'global-catalog') {
            return (
                <div className={styles.container}>
                    <div style={{ textAlign: 'center', padding: '5rem 2rem' }}>
                        <EmptyState
                            title="Base Global não inicializada"
                            description="A base global de produtos ainda não foi criada no sistema."
                            icon={Database}
                        />
                        <div style={{ marginTop: '2rem' }}>
                            <Button icon={ArrowLeft} variant="secondary" onClick={() => router.push('/admin/clients')}>
                                Voltar para Clientes
                            </Button>
                        </div>
                    </div>
                </div>
            );
        }
        return <div className={styles.loading}>Loja não encontrada</div>;
    }

    // Analytics Aggregation
    const totalViews = products.reduce((acc, p) => acc + (p.views || 0), 0);
    const totalFavorites = products.reduce((acc, p) => acc + (p.favoritesCount || 0), 0);
    const totalInteractions = products.reduce((acc, p) => acc + (p.nutritionInteractions || 0), 0);

    return (
        <div className={styles.container}>
            <div className={styles.topBar}>
                <Link href="/admin/clients" className={styles.backLink}>
                    <ArrowLeft size={16} /> Voltar para Clientes
                </Link>
            </div>

            <header className={styles.header}>
                <div>
                    <h1 className={styles.title}>{client.name}</h1>
                    <div className={styles.subtitle}>
                        <span className={styles.badge}>/{client.slug}</span>
                        {client.slug !== 'global-catalog' && (
                            <a href={`/${client.slug}`} target="_blank" className={styles.externalLink} title="Ver Loja Pública">
                                <ExternalLink size={16} />
                            </a>
                        )}
                        <span className={`${styles.statusBadge} ${client.isActive ? styles.active : styles.inactive}`}>
                            {client.isActive ? "Loja Ativa" : "Loja Inativa"}
                        </span>
                    </div>
                </div>

                <div className={styles.headerActions}>
                    {client.slug !== 'global-catalog' ? (
                        <Button
                            variant={client.isActive ? "secondary" : "primary"}
                            icon={Power}
                            onClick={handleToggleStatus}
                        >
                            {client.isActive ? "Desativar Loja" : "Ativar Loja"}
                        </Button>
                    ) : (
                        <Button
                            variant="primary"
                            icon={Download}
                            onClick={handleExportGlobalBase}
                        >
                            Exportar Base (ID + Nome + Preço)
                        </Button>
                    )}
                </div>
            </header>

            {/* TABS NAVIGATION */}
            <div className={styles.tabs}>
                <button onClick={() => setActiveTab('products')} className={activeTab === 'products' ? styles.tabActive : styles.tab}>
                    <Package size={18} /> Produtos
                </button>
                {client.slug === 'global-catalog' ? (
                    <button onClick={() => router.push(`/admin/clients/${client.slug}/categories`)} className={styles.tab}>
                        🏷️ Categorias
                    </button>
                ) : (
                    <>
                        <button onClick={() => setActiveTab('reports')} className={activeTab === 'reports' ? styles.tabActive : styles.tab}>
                            <BarChart2 size={18} /> Relatórios
                        </button>
                        <button onClick={() => setActiveTab('files')} className={activeTab === 'files' ? styles.tabActive : styles.tab}>
                            <FileText size={18} /> Arquivos
                        </button>
                        <button onClick={() => setActiveTab('settings')} className={activeTab === 'settings' ? styles.tabActive : styles.tab}>
                            <Settings size={18} /> Configurações
                        </button>
                    </>
                )}
            </div>

            {/* TAB: PRODUCTS */}
            {activeTab === 'products' && (
                <section className={styles.section}>
                    <div className={styles.sectionHeader}>
                        <h2>Produtos ({products.length})</h2>
                        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                            <Button variant="secondary" icon={Download} onClick={handleExportProducts}>Exportar</Button>
                            <Button variant="secondary" icon={Upload} onClick={() => setImportModalOpen(true)}>Importar</Button>
                            <Button icon={Plus} onClick={() => setNewProductOptionModalOpen(true)}>Novo</Button>
                        </div>
                    </div>

                    {/* Product List Render */}
                    {products.length > 0 ? (
                        <div className={styles.productList}>
                            {products.map(product => (
                                <div key={product.id} className={`${styles.productRow} ${!product.isActive ? styles.productInactive : ''}`}>
                                    <div className={styles.productInfo}>
                                        <div className={styles.productIcon}><Package size={20} color="#64748b" /></div>
                                        <div>
                                            <div className={styles.productName}>{product.name}</div>
                                            <div className={styles.productAlerts}>
                                                <span className={styles.productSlug}>/{product.slug} • R$ {product.price?.toFixed(2) || "0.00"}</span>
                                            </div>
                                        </div>
                                    </div>
                                    {/* Category Column */}
                                    <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
                                        {product.category && (
                                            <span style={{
                                                background: '#eff6ff',
                                                color: '#2563eb',
                                                padding: '4px 12px',
                                                borderRadius: '16px',
                                                fontSize: '0.85rem',
                                                fontWeight: '600',
                                                border: '1px solid #dbeafe'
                                            }}>
                                                {product.category}
                                            </span>
                                        )}
                                    </div>
                                    <div className={styles.productActions}>
                                        <button className={styles.iconButton} title="Ver Página Pública" onClick={() => window.open(`/${client.slug}/${product.slug}`, '_blank')}>
                                            <ExternalLink size={18} color="#2563eb" />
                                        </button>
                                        <button className={styles.iconButton} onClick={() => router.push(`/admin/clients/${client.slug}/products/${product.id}`)}><Edit2 size={18} color="#64748b" /></button>
                                        <button className={styles.iconButton} onClick={() => toggleProductStatus(product.id)}>
                                            <Power size={18} color={product.isActive ? "#16a34a" : "#dc2626"} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div style={{ padding: '3rem' }}>
                            <EmptyState
                                title={client.slug === 'global-catalog' ? "Nenhum produto global" : "Nenhum produto nesta loja"}
                                description={client.slug === 'global-catalog' ? "O catálogo global está vazio. Comece importando produtos." : "Esta loja ainda não possui produtos cadastrados."}
                                icon={Package}
                            />
                        </div>
                    )}
                </section>
            )}

            {/* TAB: REPORTS */}
            {activeTab === 'reports' && (
                <section className={styles.section}>
                    <h2 style={{ marginBottom: '1.5rem' }}>Analytics de Produtos</h2>

                    {/* Summary Cards */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
                        <div className={styles.statCard}>
                            <div style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '0.5rem' }}>Visualizações de Produtos</div>
                            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#2563eb' }}>{totalViews}</div>
                        </div>
                        <div className={styles.statCard}>
                            <div style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '0.5rem' }}>Produtos Favoritados</div>
                            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#ef4444' }}>{totalFavorites}</div>
                        </div>
                        <div className={styles.statCard}>
                            <div style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '0.5rem' }}>Interações Nutricionais</div>
                            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#10b981' }}>{totalInteractions}</div>
                        </div>
                    </div>

                    {/* Detailed Product Table */}
                    <div style={{ background: 'white', borderRadius: '12px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                                <tr>
                                    <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.85rem', color: '#64748b' }}>Produto</th>
                                    <th style={{ padding: '1rem', textAlign: 'center', fontSize: '0.85rem', color: '#64748b' }}>Visualizações</th>
                                    <th style={{ padding: '1rem', textAlign: 'center', fontSize: '0.85rem', color: '#64748b' }}>Favoritos</th>
                                    <th style={{ padding: '1rem', textAlign: 'center', fontSize: '0.85rem', color: '#64748b' }}>Interações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {[...products].sort((a, b) => (b.views || 0) - (a.views || 0)).map(product => (
                                    <tr
                                        key={product.id}
                                        style={{ borderBottom: '1px solid #f1f5f9', cursor: 'pointer' }}
                                        onClick={() => setSelectedProductForLogs(product)}
                                        className={styles.reportRow}
                                    >
                                        <td style={{ padding: '1rem', fontWeight: '500', color: '#334155' }}>
                                            {product.name}
                                            <div style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 'normal' }}>Clique para ver detalhes</div>
                                        </td>
                                        <td style={{ padding: '1rem', textAlign: 'center', color: '#334155' }}>{product.views || 0}</td>
                                        <td style={{ padding: '1rem', textAlign: 'center', color: '#334155' }}>{product.favoritesCount || 0}</td>
                                        <td style={{ padding: '1rem', textAlign: 'center', color: '#334155' }}>{product.nutritionInteractions || 0}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>
            )}

            {/* TAB: FILES */}
            {activeTab === 'files' && (
                <section className={styles.section}>
                    <div className={styles.sectionHeader}>
                        <h2>Arquivos da Loja</h2>
                        <div>
                            <input
                                type="file"
                                onChange={handleFileUpload}
                                ref={fileInputRef}
                                style={{ display: 'none' }}
                                id="file-upload"
                            />
                            <label htmlFor="file-upload" className={styles.button} style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '0.5rem 1rem', background: '#2563eb', color: 'white', borderRadius: '8px', fontSize: '0.9rem' }}>
                                <Upload size={16} /> {uploading ? "Enviando..." : "Enviar Arquivo"}
                            </label>
                        </div>
                    </div>

                    {files.length === 0 ? (
                        <div className={styles.emptyState}>
                            <Paperclip size={48} color="#cbd5e1" style={{ marginBottom: '1rem' }} />
                            <p>Nenhum arquivo encontrado.</p>
                            <p style={{ fontSize: '0.85rem', color: '#94a3b8' }}>Envie PDFs, QR Codes ou imagens para armazenar aqui.</p>
                        </div>
                    ) : (
                        <div className={styles.fileGrid}>
                            {files.map(file => (
                                <div key={file.id} className={styles.fileCard} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem', background: 'white', borderRadius: '8px', border: '1px solid #e2e8f0', marginBottom: '0.5rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                        <div style={{ background: '#f1f5f9', padding: '10px', borderRadius: '8px' }}>
                                            <FileText size={20} color="#64748b" />
                                        </div>
                                        <div>
                                            <div style={{ fontWeight: '500', color: '#334155' }}>{file.name}</div>
                                            <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>{(file.size / 1024).toFixed(1)} KB • {new Date(file.createdAt).toLocaleDateString()}</div>
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                                        <a href={file.url} target="_blank" rel="noopener noreferrer" className={styles.iconButton} title="Visualizar">
                                            <Eye size={18} color="#2563eb" />
                                        </a>
                                        <button className={styles.iconButton} onClick={() => handleDeleteFile(file.id)} title="Excluir">
                                            <Trash2 size={18} color="#ef4444" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </section>
            )}

            {/* TAB: SETTINGS */}
            {activeTab === 'settings' && (
                <section className={styles.section}>
                    <div style={{ background: 'white', padding: '2rem', borderRadius: '12px', border: '1px solid #e2e8f0', maxWidth: '800px' }}>
                        <div style={{ marginBottom: '1.5rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#1e293b' }}>Descrição da Loja</label>
                            <textarea rows={4} value={description} onChange={(e) => setDescription(e.target.value)} style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
                        </div>
                        <div style={{ marginBottom: '1.5rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', color: '#1e293b' }}>Logo (URL)</label>
                            <input type="text" value={storeLogo} onChange={(e) => setStoreLogo(e.target.value)} style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
                        </div>
                        <Button onClick={handleSaveSettings} disabled={saving} icon={Save}>{saving ? "Salvando..." : "Salvar"}</Button>
                    </div>
                </section>
            )}

            {/* Modals for Import/New Product (Reusable from before, kept mostly same logic) */}
            {newProductOptionModalOpen && (
                <div className={styles.modalOverlay} onClick={() => setNewProductOptionModalOpen(false)}>
                    <div className={styles.modal} onClick={e => e.stopPropagation()} style={{ maxWidth: '500px', textAlign: 'center' }}>
                        <h2>Adicionar Produto</h2>
                        <div style={{ display: 'grid', gap: '1rem', marginTop: '1rem' }}>
                            <button onClick={() => router.push(`/admin/clients/${params.clientSlug}/products/new`)} className={styles.optionButton}>Criar do Zero</button>
                            {client.slug !== 'global-catalog' && (
                                <button onClick={() => { setNewProductOptionModalOpen(false); setGlobalCatalogOpen(true); }} className={styles.optionButton}>Selecionar da Base Global</button>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Keeping the Import Modal logic... */}
            {importModalOpen && (
                <div className={styles.modalOverlay} onClick={() => setImportModalOpen(false)}>
                    <div className={styles.modal} onClick={e => e.stopPropagation()} style={{ maxWidth: '650px' }}>
                        <div className={styles.modalHeader}>
                            <h2 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Importação em Massa</h2>
                            <button className={styles.closeBtn} onClick={() => setImportModalOpen(false)}><X size={20} /></button>
                        </div>

                        <div className={styles.importSteps}>
                            <div className={`${styles.importStepAlt} ${importStep === 1 ? styles.importStepActiveAlt : ''}`} onClick={() => setImportStep(1)}>1. Instruções (Prompt)</div>
                            <div className={`${styles.importStepAlt} ${importStep === 2 ? styles.importStepActiveAlt : ''}`} onClick={() => setImportStep(2)}>2. Colar JSON</div>
                        </div>

                        {importStep === 1 ? (
                            <div className={styles.promptStep}>
                                <div style={{ display: 'flex', gap: '10px', marginBottom: '1rem' }}>
                                    <button
                                        disabled
                                        style={{ flex: 1, padding: '12px', borderRadius: '8px', border: '1px solid #e2e8f0', background: 'white', color: '#cbd5e1', cursor: 'not-allowed', fontWeight: 600 }}
                                    >
                                        Lojas + Produtos
                                    </button>
                                    <button
                                        style={{ flex: 1, padding: '12px', borderRadius: '8px', border: '2px solid #2563eb', background: 'white', fontWeight: 600, color: '#2563eb', cursor: 'pointer' }}
                                    >
                                        Apenas Produtos
                                    </button>
                                </div>
                                <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                                    Use este prompt para gerar produtos avulsos para esta loja específica.
                                </p>
                                <div className={styles.promptBoxAlt}>
                                    <pre>{FULL_PROMPT_TEXT}</pre>
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
                                    placeholder='[{ "name": "...", "category": "...", "price": 0.00, ... }]'
                                    value={importJson}
                                    onChange={(e) => setImportJson(e.target.value)}
                                    autoFocus
                                />
                                <div className={styles.modalActions}>
                                    <Button variant="secondary" onClick={() => setImportStep(1)}>Voltar</Button>
                                    <Button
                                        onClick={handleImport}
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

            {globalCatalogOpen && (
                <div className={styles.modalOverlay} onClick={() => setGlobalCatalogOpen(false)}>
                    <div className={styles.modal} onClick={e => e.stopPropagation()} style={{ maxWidth: '800px', height: '80vh' }}>
                        <h2>Catálogo Global</h2>
                        <input value={globalSearchQuery} onChange={e => setGlobalSearchQuery(e.target.value)} placeholder="Buscar..." style={{ width: '100%', padding: '10px', marginBottom: '1rem' }} />
                        <div style={{ maxHeight: '60vh', overflowY: 'auto' }}>
                            {globalProducts.map(p => (
                                <div key={p.id} onClick={() => setSelectedGlobalProducts(prev => [...prev, p])} style={{ padding: '10px', borderBottom: '1px solid #ddd', cursor: 'pointer' }}>
                                    {p.name}
                                </div>
                            ))}
                        </div>
                        <Button onClick={handleBulkClone}>Clonar Selecionados</Button>
                    </div>
                </div>
            )}

            {/* Logs Modal */}
            {selectedProductForLogs && (
                <InteractionLogModal
                    productId={selectedProductForLogs.id}
                    productName={selectedProductForLogs.name}
                    onClose={() => setSelectedProductForLogs(null)}
                />
            )}

        </div>
    );
}

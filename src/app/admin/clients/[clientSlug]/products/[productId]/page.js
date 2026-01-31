"use client";
import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useData } from '@/context/DataContext';
import { useToast } from '@/components/ui/Toast/ToastProvider';
import { ArrowLeft, Save } from 'lucide-react';
import Link from 'next/link';
import Button from '@/components/ui/Button/Button';
import TagInput from '@/components/ui/Form/TagInput';
import RepeaterField from '@/components/ui/Form/RepeaterField';
import ImageUploader from '@/components/ui/ImageUploader/ImageUploader';
import CreatableSelect from '@/components/ui/CreatableSelect/CreatableSelect';
import styles from '../new/page.module.css'; // Reuse styles from New Product

export default function EditProductPage() {
    const params = useParams();
    const router = useRouter();
    const { getClientBySlug, updateProduct, isLoaded, getCategories } = useData();
    const { addToast } = useToast();
    const [client, setClient] = useState(null);
    const [originalProduct, setOriginalProduct] = useState(null);

    // Form State
    const [name, setName] = useState("");
    const [slug, setSlug] = useState("");
    const [price, setPrice] = useState("");
    const [marketPrice, setMarketPrice] = useState(""); // Global Price State
    const [unit, setUnit] = useState("un");
    const [category, setCategory] = useState("");
    const [emoji, setEmoji] = useState("");
    const [description, setDescription] = useState("");

    // Dynamic Fields
    const [nutrition, setNutrition] = useState([]);
    const [benefits, setBenefits] = useState([]);
    const [tags, setTags] = useState([]);
    const [tips, setTips] = useState([]);
    const [helpsWith, setHelpsWith] = useState([]);
    const [images, setImages] = useState([]);

    // Categories State
    const [categoryOptions, setCategoryOptions] = useState([]);

    useEffect(() => {
        getCategories().then(setCategoryOptions);
    }, [getCategories]);

    useEffect(() => {
        if (isLoaded && params?.clientSlug && params?.productId) {
            const foundClient = getClientBySlug(params.clientSlug);
            setClient(foundClient);

            if (foundClient) {
                const product = foundClient.products?.find(p => p.id === params.productId);
                if (product) {
                    setOriginalProduct(product);
                    // Fill Form
                    setName(product.name || "");
                    setSlug(product.slug || "");
                    setPrice(product.price || "");
                    setUnit(product.unit || "un");
                    setCategory(product.category || "");
                    setEmoji(product.emoji || "");
                    setDescription(product.description || "");
                    setNutrition(product.nutrition || []);
                    setBenefits(product.benefits || []);
                    setTags(product.tags || []);
                    setTips(product.tips || []);
                    setHelpsWith(product.helpsWith || []);
                    setHelpsWith(product.helpsWith || []);
                    setImages(product.images && product.images.length > 0 ? product.images : (product.image ? [product.image] : []));

                    setMarketPrice(product.marketPrice || "");

                    // Optional: Sync with Global Catalog if local marketPrice is missing
                    if (!product.marketPrice) {
                        const globalClient = getClientBySlug('global-catalog');
                        if (globalClient) {
                            const globalProduct = globalClient.products?.find(p =>
                                (product.parentProductId && p.id === product.parentProductId) ||
                                p.slug === product.slug
                            );
                            if (globalProduct) {
                                setMarketPrice(globalProduct.price || "");
                            }
                        }
                    }
                } else {
                    addToast("Produto não encontrado.", "error");
                    router.push(`/admin/clients/${params.clientSlug}`);
                }
            }
        }
    }, [isLoaded, params, getClientBySlug, router, addToast]);

    const handleNameChange = (e) => {
        setName(e.target.value);
        // Only auto-update slug if it matches the simplified name (fresh entry behavior), 
        // but for edit, we usually keep the existing slug unless manually changed to avoid breaking SEO links.
        // So we won't auto-update slug here.
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!name || !slug || !price) {
            addToast("Preencha os campos obrigatórios.", "error");
            return;
        }

        const updatedData = {
            name,
            slug,
            price: Number(price),
            marketPrice: marketPrice ? Number(marketPrice) : null, // Send marketPrice as number
            unit,
            category,
            emoji,
            description,
            nutrition,
            benefits,
            tags,
            tips,
            helpsWith,
            images,
            image: images.length > 0 ? images[0] : "",
        };

        try {
            await updateProduct(originalProduct.id, updatedData);
            addToast("Produto atualizado com sucesso!", "success");
            router.push(`/admin/clients/${params.clientSlug}`);
        } catch (error) {
            console.error("Error updating product:", error);
            addToast(`Erro: ${error.response?.data?.error || "Falha ao atualizar"}`, "error");
        }
    };

    if (!isLoaded) return <div>Carregando...</div>;
    if (!client || !originalProduct) return <div>Carregando produto...</div>;

    return (
        <div className={styles.container}>
            <div className={styles.topBar}>
                <Link href={`/admin/clients/${params.clientSlug}`} className={styles.backLink}>
                    <ArrowLeft size={16} /> Voltar
                </Link>
                <h1 className={styles.title}>Editar Produto</h1>
            </div>

            <form onSubmit={handleSubmit} className={styles.formGrid}>
                {/* Left Column: Basic Info & Nutrition */}
                <div className={styles.column}>
                    <div className={styles.card}>
                        <h2 className={styles.cardTitle}>Informações Básicas</h2>

                        <div className={styles.formGroup}>
                            <label>Nome do Produto *</label>
                            <input type="text" value={name} onChange={handleNameChange} placeholder="Ex: Mel Silvestre" required />
                        </div>

                        <div className={styles.formGroup}>
                            <label>Slug (URL) *</label>
                            <input type="text" value={slug} onChange={(e) => setSlug(e.target.value)} required />
                        </div>

                        <div className={styles.row}>
                            <div className={styles.formGroup}>
                                <label>Preço Loja (Interno) *</label>
                                <input type="number" step="0.01" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="0.00" required />
                            </div>
                            <div className={styles.formGroup}>
                                <label>Preço Global (Mercado)</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    value={marketPrice}
                                    onChange={(e) => setMarketPrice(e.target.value)}
                                    placeholder="0.00"
                                    style={{ borderColor: '#f59e0b' }} // Orange border to distinguish
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label>Unidade</label>
                                <input type="text" value={unit} onChange={(e) => setUnit(e.target.value)} placeholder="500g" />
                            </div>
                        </div>

                        <div className={styles.row} style={{ alignItems: 'flex-end' }}>
                            <div className={styles.formGroup} style={{ flex: 1 }}>
                                <label>Categoria</label>
                                <CreatableSelect
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                    options={categoryOptions}
                                    placeholder="Selecione ou crie uma categoria..."
                                />
                            </div>
                            <div className={styles.formGroup} style={{ width: '80px' }}>
                                <label>Emoji</label>
                                <input
                                    type="text"
                                    value={emoji}
                                    onChange={(e) => setEmoji(e.target.value)}
                                    placeholder="🥜"
                                    maxLength={2}
                                    style={{ textAlign: 'center', fontSize: '1.2rem' }}
                                />
                            </div>
                        </div>

                        <div className={styles.formGroup}>
                            <label>Descrição</label>
                            <textarea rows={4} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Detalhes do produto..."></textarea>
                        </div>

                        <div className={styles.formGroup}>
                            <label>Imagem (URL Pública)</label>
                            <input
                                type="text"
                                value={images[0] || ""}
                                onChange={(e) => setImages([e.target.value])}
                                placeholder="https://images.unsplash.com/..."
                            />
                            {images[0] && (
                                <div style={{ marginTop: '10px', width: '100%', height: '200px', borderRadius: '8px', overflow: 'hidden', border: '1px solid #e2e8f0' }}>
                                    <img src={images[0]} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                </div>
                            )}
                        </div>
                    </div>

                    <div className={styles.card}>
                        <RepeaterField
                            label="Tabela Nutricional"
                            items={nutrition}
                            onChange={setNutrition}
                            itemLabel="Nutriente"
                        />
                    </div>
                </div>

                {/* Right Column: Dynamic Lists */}
                <div className={styles.column}>
                    <div className={styles.card}>
                        <h2 className={styles.cardTitle}>Conteúdo Dinâmico</h2>

                        <TagInput
                            label="Benefícios (Chips Verdes)"
                            tags={benefits}
                            onChange={setBenefits}
                            placeholder="Ex: Rico em Fibras..."
                        />

                        <TagInput
                            label="Ajuda Com (Chips Laranjas)"
                            tags={helpsWith}
                            onChange={setHelpsWith}
                            placeholder="Ex: Tosse, Imunidade..."
                        />

                        <TagInput
                            label="Tags / Combinações"
                            tags={tags}
                            onChange={setTags}
                            placeholder="Ex: Queijo, Iogurte..."
                        />

                        <TagInput
                            label="Dicas de Consumo (Lista)"
                            tags={tips}
                            onChange={setTips}
                            placeholder="Ex: Consumir pela manhã..."
                        />
                    </div>
                </div>
            </form>

            <div className={styles.footerActions}>
                <Button onClick={handleSubmit} icon={Save} style={{ width: '200px' }}>
                    Salvar Alterações
                </Button>
            </div>
        </div>
    );
}

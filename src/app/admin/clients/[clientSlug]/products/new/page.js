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
import styles from './page.module.css';

export default function NewProductPage() {
    const params = useParams();
    const router = useRouter();
    const { getClientBySlug, addProduct, isLoaded } = useData();
    const { addToast } = useToast();
    const [client, setClient] = useState(null);

    // Form State
    const [name, setName] = useState("");
    const [slug, setSlug] = useState("");
    const [price, setPrice] = useState("");
    const [unit, setUnit] = useState("un");
    const [category, setCategory] = useState("");
    const [description, setDescription] = useState("");

    // Dynamic Fields
    const [nutrition, setNutrition] = useState([]);
    const [benefits, setBenefits] = useState([]);
    const [tags, setTags] = useState([]);
    const [tips, setTips] = useState([]);
    const [helpsWith, setHelpsWith] = useState([]);
    const [images, setImages] = useState([]);

    useEffect(() => {
        if (isLoaded && params?.clientSlug) {
            const found = getClientBySlug(params.clientSlug);
            setClient(found);
        }
    }, [isLoaded, params, getClientBySlug]);

    const handleNameChange = (e) => {
        const val = e.target.value;
        setName(val);
        setSlug(val.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, ''));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!name || !slug || !price) {
            addToast("Preencha os campos obrigatórios.", "error");
            return;
        }

        const newProduct = {
            clientId: client.id,
            name,
            slug,
            price,
            unit,
            category,
            description,
            nutrition,
            benefits,
            tags,
            tips,
            helpsWith,
            images,
            image: images.length > 0 ? images[0] : "", // Backward compatibility
            isActive: true
        };

        console.log("Submitting Product:", newProduct);
        try {
            await addProduct(client.id, newProduct);
            console.log("Product created successfully");
            addToast("Produto criado com sucesso!", "success");
            router.push(`/admin/clients/${params.clientSlug}`);
        } catch (error) {
            console.error("Error creating product:", error);
            console.error("Error Response:", error.response?.data);
            addToast(`Erro: ${error.response?.data?.error || "Falha ao criar"}`, "error");
        }
    };

    if (!isLoaded) return <div>Carregando...</div>;
    if (!client) return <div>Cliente não encontrado.</div>;

    return (
        <div className={styles.container}>
            <div className={styles.topBar}>
                <Link href={`/admin/clients/${params.clientSlug}`} className={styles.backLink}>
                    <ArrowLeft size={16} /> Voltar
                </Link>
                <h1 className={styles.title}>Novo Produto</h1>
            </div>

            <form onSubmit={handleSubmit} className={styles.formGrid}>
                {/* Left Column: Basic Info */}
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
                                <label>Preço *</label>
                                <input type="text" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="R$ 0,00" required />
                            </div>
                            <div className={styles.formGroup}>
                                <label>Unidade</label>
                                <input type="text" value={unit} onChange={(e) => setUnit(e.target.value)} placeholder="500g" />
                            </div>
                        </div>

                        <div className={styles.formGroup}>
                            <label>Categoria</label>
                            <input type="text" value={category} onChange={(e) => setCategory(e.target.value)} placeholder="Ex: Adoçantes" />
                        </div>

                        <div className={styles.formGroup}>
                            <label>Descrição</label>
                            <textarea rows={4} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Detalhes do produto..."></textarea>
                        </div>

                        <div className={styles.formGroup}>
                            <label>Galeria de Imagens</label>
                            <ImageUploader images={images} onChange={setImages} />
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
                    Salvar Produto
                </Button>
            </div>
        </div>
    );
}

// ... (Top imports remain the same)
import styles from './page.module.css';
import { Droplets, Leaf, ExternalLink, TriangleAlert } from 'lucide-react'; // New icons

export default function ProductDetail() {
    // ... (Hooks and State Loading logic remain similar, updated to fetch categories for the header emoji)

    const params = useParams();
    const { getClientBySlug, isLoaded, getClientCategories } = useData();
    const [loading, setLoading] = useState(true);
    const [product, setProduct] = useState(null);
    const [client, setClient] = useState(null);
    const [categoryEmoji, setCategoryEmoji] = useState(null);

    // ...

    useEffect(() => {
        const loadData = async () => {
            if (!isLoaded || !params?.clientSlug || !params?.productSlug) return;

            const clientFound = getClientBySlug(params.clientSlug);
            if (clientFound && clientFound.isActive) {
                setClient(clientFound);
                const found = clientFound.products.find(p => p.slug === params.productSlug && p.isActive);
                setProduct(found);

                // Fetch Category Emoji
                if (found?.category) {
                    try {
                        const categories = await getClientCategories(clientFound.id);
                        const cat = categories.find(c => c.name === found.category);
                        if (cat) setCategoryEmoji(cat.emoji);
                    } catch (err) { console.error(err); }
                }
            }
            setLoading(false);
        };
        loadData();
    }, [isLoaded, params, getClientBySlug, getClientCategories]);

    if (!loading && !product) return <EmptyState title="Produto não encontrado" />;

    return (
        <main className={styles.container}>
            {/* Blue Gradient Header */}
            <header className={styles.header}>
                {loading ? (
                    <div className={styles.headerLoading} />
                ) : (
                    <div className={styles.headerContent}>
                        <div className={styles.storeIcon}>
                            {categoryEmoji || '🌱'} {/* Fallback to Leaf */}
                        </div>
                        <h1 className={styles.storeName}>{client?.name || 'Loja'}</h1>
                        <p className={styles.storeSubtitle}>Informações de Produtos a Granel</p>
                    </div>
                )}
            </header>

            {/* Floating White Card */}
            <div className={styles.cardContainer}>
                {loading ? (
                    <div className={styles.card} style={{ height: '400px' }}>Loading...</div>
                ) : (
                    <div className={styles.card}>
                        <div className={styles.productHeader}>
                            <div className={styles.productEmoji}>
                                {product.emoji || '📦'}
                            </div>
                            <div>
                                <h2 className={styles.productName}>{product.name}</h2>
                                <span className={styles.productCategory}>{product.category || 'Geral'}</span>
                            </div>
                            <button className={styles.likeButton}>
                                <div className={styles.heartIcon} /> {/* Simplified heart */}
                            </button>
                        </div>

                        <p className={styles.description}>
                            {product.description}
                        </p>

                        <div className={styles.nutritionSection}>
                            <div className={styles.sectionTitle}>
                                <Droplets size={18} fill="#3b82f6" color="#3b82f6" style={{ marginRight: '8px' }} />
                                Informações Nutricionais (por 100g)
                            </div>
                            <NutritionTable data={product.nutrition} />
                        </div>

                        {product.benefits && product.benefits.length > 0 && (
                            <div className={styles.dynamicSection}>
                                <div className={styles.sectionTitle}>
                                    <Leaf size={18} fill="#22c55e" color="#22c55e" style={{ marginRight: '8px' }} />
                                    Benefícios Principais
                                </div>
                                <div className={styles.list}>
                                    {product.benefits.map((b, i) => (
                                        <div key={i} className={styles.listItem}>
                                            <div className={styles.checkIcon}>✔</div>
                                            {b}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {product.helpsWith && product.helpsWith.length > 0 && (
                            <div className={styles.dynamicSection}>
                                <div className={styles.sectionTitle}>
                                    <TriangleAlert size={18} fill="#f59e0b" color="#f59e0b" style={{ marginRight: '8px' }} />
                                    Pode Ajudar Com
                                </div>
                                <div className={styles.list}>
                                    {product.helpsWith.map((h, i) => (
                                        <div key={i} className={styles.listItem}>
                                            <div className={styles.checkIcon}>✔</div>
                                            {h}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Tags / Combinations */}
                        {product.tags && product.tags.length > 0 && (
                            <div className={styles.dynamicSection}>
                                <div className={styles.sectionTitle}>
                                    <ExternalLink size={18} color="#64748b" style={{ marginRight: '8px' }} />
                                    Combina Bem Com
                                </div>
                                <div className={styles.tags}>
                                    {product.tags.map((t, i) => (
                                        <span key={i} className={styles.tag}>{t}</span>
                                    ))}
                                </div>
                            </div>
                        )}


                        {/* Educational Disclaimer */}
                        <div className={styles.disclaimerBox}>
                            <strong>ℹ️ Informação Educacional:</strong> Este conteúdo é apenas informativo e não substitui orientação médica profissional. Consulte um médico ou nutricionista antes de usar como tratamento.
                        </div>

                        <div style={{ marginTop: '2rem', textAlign: 'center' }}>
                            <Link href={`/${params.clientSlug}`} className={styles.backLink}>
                                Voltar para Home
                            </Link>
                            <div style={{ marginTop: '1rem', fontSize: '0.8rem', color: '#cbd5e1' }}>
                                Versão 1.0 | Janeiro 2026
                            </div>
                        </div>

                    </div>
                )}
            </div>
        </main>
    );
}

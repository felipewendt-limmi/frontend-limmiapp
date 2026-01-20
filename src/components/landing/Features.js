import { Layout, Zap, Database } from 'lucide-react';
import styles from './Landing.module.css';

export default function Features() {
    const features = [
        {
            icon: <Layout size={32} color="#2563eb" />,
            title: "Design Premium",
            description: "Templates com estética cinematográfica que valorizam seus produtos."
        },
        {
            icon: <Database size={32} color="#2563eb" />,
            title: "Dados Flexíveis",
            description: "Crie campos personalizados para Nutrição, Benefícios e muito mais."
        },
        {
            icon: <Zap size={32} color="#2563eb" />,
            title: "Atualização em Tempo Real",
            description: "Alterações no painel refletem instantaneamente na loja do cliente."
        }
    ];

    return (
        <section className={styles.features}>
            <div className={styles.container}>
                <h2 className={styles.sectionTitle}>Por que escolher a Limmi?</h2>
                <div className={styles.grid}>
                    {features.map((f, i) => (
                        <div key={i} className={styles.card}>
                            <div className={styles.iconWrapper}>{f.icon}</div>
                            <h3>{f.title}</h3>
                            <p>{f.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

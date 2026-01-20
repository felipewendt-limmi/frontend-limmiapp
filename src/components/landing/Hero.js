import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import styles from './Landing.module.css';

export default function Hero() {
    return (
        <section className={styles.hero}>
            <div className={styles.container}>
                <h1 className={styles.title}>Crie sua Loja Virtual <span className={styles.highlight}>Premium</span> em Minutos.</h1>
                <p className={styles.subtitle}>A plataforma completa para lojistas que buscam design cinematográfico e gestão simplificada.</p>
                <div className={styles.actions}>
                    <a href="https://wa.me/5511999999999" target="_blank" className={styles.ctaButton}>
                        Fale Conosco <ArrowRight size={20} />
                    </a>
                </div>
            </div>
        </section>
    );
}

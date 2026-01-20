
import { Phone, Mail, Instagram } from 'lucide-react';
import styles from './Landing.module.css';

export default function Contact() {
    return (
        <section className={styles.contact} id="contact">
            <div className={styles.container}>
                <h2 className={styles.sectionTitle}>Entre em Contato</h2>
                <div className={styles.contactGrid}>
                    <a href="https://wa.me/5511999999999" target="_blank" className={styles.contactCard}>
                        <div className={styles.iconWrapper}>
                            <Phone size={32} color="#2563eb" />
                        </div>
                        <h3>WhatsApp</h3>
                        <p>Fale diretamente conosco para saber mais.</p>
                    </a>
                    <a href="mailto:contato@limmi.com" className={styles.contactCard}>
                        <div className={styles.iconWrapper}>
                            <Mail size={32} color="#2563eb" />
                        </div>
                        <h3>Email</h3>
                        <p>Envie suas dúvidas para nossa equipe.</p>
                    </a>
                    <a href="#" className={styles.contactCard}>
                        <div className={styles.iconWrapper}>
                            <Instagram size={32} color="#2563eb" />
                        </div>
                        <h3>Instagram</h3>
                        <p>Siga nosso perfil e acompanhe as novidades.</p>
                    </a>
                </div>
            </div>
        </section>
    );
}

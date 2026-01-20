import React from 'react';
import styles from './Footer.module.css';

export default function Footer() {
    return (
        <footer className={styles.footer}>
            <div className={styles.container}>
                <div className={styles.column}>
                    <h4>LIMMI Granel</h4>
                    <p>Tecnologia viva conectando você aos melhores produtos naturais.</p>
                </div>
                <div className={styles.column}>
                    <h4>Links Úteis</h4>
                    <div className={styles.links}>
                        <a href="#">Sobre nós</a>
                        <a href="#">Produtos</a>
                        <a href="#">Contato</a>
                    </div>
                </div>
                <div className={styles.column}>
                    <h4>Legal</h4>
                    <div className={styles.links}>
                        <a href="#">Termos de Uso</a>
                        <a href="#">Privacidade</a>
                    </div>
                </div>
            </div>
            <div className={styles.bottom}>
                &copy; {new Date().getFullYear()} LIMMI Granel. Todos os direitos reservados.
            </div>
        </footer>
    );
}

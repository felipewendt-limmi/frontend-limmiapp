import React, { useEffect, useState } from 'react';
import styles from './InteractionLogModal.module.css'; // We'll create basic inline styles or module
import { X, Clock, Globe, Activity } from 'lucide-react';
import Button from '@/components/ui/Button/Button';
import { useData } from '@/context/DataContext';

export default function InteractionLogModal({ productId, productName, onClose }) {
    const { getProductInteractions } = useData();
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (productId) {
            setLoading(true);
            getProductInteractions(productId)
                .then(data => setLogs(data))
                .catch(err => console.error(err))
                .finally(() => setLoading(false));
        }
    }, [productId, getProductInteractions]);

    return (
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.modal} onClick={e => e.stopPropagation()}>
                <div className={styles.header}>
                    <h3>Logs de Interação: {productName}</h3>
                    <button onClick={onClose} className={styles.closeBtn}><X size={20} /></button>
                </div>

                <div className={styles.content}>
                    {loading ? (
                        <div className={styles.loading}>Carregando logs...</div>
                    ) : logs.length === 0 ? (
                        <div className={styles.empty}>Nenhuma interação registrada recentemente.</div>
                    ) : (
                        <table className={styles.table}>
                            <thead>
                                <tr>
                                    <th>Data/Hora</th>
                                    <th>Tipo</th>
                                    <th>IP</th>
                                    <th>Dispositivo</th>
                                </tr>
                            </thead>
                            <tbody>
                                {logs.map(log => (
                                    <tr key={log.id}>
                                        <td style={{ whiteSpace: 'nowrap' }}>
                                            {new Date(log.createdAt).toLocaleString('pt-BR')}
                                        </td>
                                        <td>
                                            <span className={`${styles.badge} ${styles[log.type]}`}>
                                                {log.type === 'view' ? 'Visualização' :
                                                    log.type === 'favorite' ? 'Favorito' :
                                                        log.type === 'nutrition' ? 'Nutrição' : log.type}
                                            </span>
                                        </td>
                                        <td className={styles.mono}>{log.ipAddress || '-'}</td>
                                        <td className={styles.small} title={log.userAgent}>
                                            {log.userAgent ? (log.userAgent.includes('Mobile') ? 'Mobile' : 'Desktop') : '-'}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
}

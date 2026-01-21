import React from 'react';
import styles from './NutritionTable.module.css';

export default function NutritionTable({ data }) {
    // Handle both new array format and legacy object format
    const items = Array.isArray(data) ? data : (data?.items || []);

    if (items.length === 0) return null;

    const [baseAmount, setBaseAmount] = React.useState(100);

    const calculateValue = (val) => {
        if (!val) return "-";
        // Extract number and unit
        const match = val.toString().match(/^([\d.,]+)\s*(.*)$/);
        if (!match) return val;

        const originalNum = parseFloat(match[1].replace(',', '.'));
        const unit = match[2];

        if (isNaN(originalNum)) return val;

        const scale = baseAmount / 100;
        const newVal = (originalNum * scale);

        // Format: decimal if needed, otherwise integer. Replace dot with comma for PT-BR
        const formatted = newVal % 1 !== 0 ? newVal.toFixed(1) : newVal.toFixed(0);
        return `${formatted.replace('.', ',')} ${unit}`;
    };

    return (
        <div className={styles.container}>
            {/* Calculation Input */}
            <div className={styles.calculationRow}>
                <span className={styles.calcLabel}>Calcular para:</span>
                <div className={styles.calcInputGroup}>
                    <input
                        type="number"
                        value={baseAmount}
                        onChange={(e) => setBaseAmount(Number(e.target.value))}
                        className={styles.calcInput}
                    />
                    <span className={styles.calcUnit}>gramas</span>
                </div>
            </div>

            <div className={styles.header}>Informação Nutricional</div>
            <div>
                {/* Legacy portion support if needed */}
                {data?.portion && (
                    <div className={styles.row}>
                        <span className={styles.label}>Porção Base</span>
                        <span className={styles.value}>{data.portion}</span>
                    </div>
                )}

                {items.map((item, index) => (
                    <div key={index} className={styles.row}>
                        <span className={styles.label}>{item.label || item.key}</span>
                        <span className={styles.value}>{calculateValue(item.value)}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

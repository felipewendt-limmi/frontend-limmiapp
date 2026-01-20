"use client";
import React from 'react';
import { Trash2, Plus } from 'lucide-react';

export default function RepeaterField({ label, items, onChange, itemLabel = "Item" }) {

    const addItem = () => {
        onChange([...items, { label: "", value: "" }]);
    };

    const updateItem = (index, field, val) => {
        const newItems = items.map((item, i) => {
            if (i === index) {
                return { ...item, [field]: val };
            }
            return item;
        });
        onChange(newItems);
    };

    const removeItem = (index) => {
        onChange(items.filter((_, i) => i !== index));
    };

    return (
        <div style={{ marginBottom: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', alignItems: 'center' }}>
                <label style={{ fontSize: '1rem', fontWeight: '600', color: '#1e293b' }}>{label}</label>
                <button
                    type="button"
                    onClick={addItem}
                    style={{
                        fontSize: '0.875rem',
                        color: 'var(--primary)',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                    }}
                >
                    <Plus size={16} /> Adicionar {itemLabel}
                </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {items.map((item, index) => (
                    <div key={index} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', animation: 'fadeIn 0.3s' }}>
                        <div style={{ flex: 1 }}>
                            <input
                                type="text"
                                placeholder="Nome (ex: Calorias)"
                                value={item.label}
                                onChange={(e) => updateItem(index, 'label', e.target.value)}
                                style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}
                            />
                        </div>
                        <div style={{ flex: 1 }}>
                            <input
                                type="text"
                                placeholder="Valor (ex: 120 kcal)"
                                value={item.value}
                                onChange={(e) => updateItem(index, 'value', e.target.value)}
                                style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}
                            />
                        </div>
                        <button
                            type="button"
                            onClick={() => removeItem(index)}
                            style={{
                                padding: '0.75rem',
                                background: '#fee2e2',
                                color: '#ef4444',
                                border: 'none',
                                borderRadius: '8px',
                                cursor: 'pointer'
                            }}
                        >
                            <Trash2 size={18} />
                        </button>
                    </div>
                ))}
                {items.length === 0 && (
                    <div style={{ padding: '2rem', textAlign: 'center', background: '#f8fafc', borderRadius: '8px', border: '1px dashed #cbd5e1', color: '#94a3b8' }}>
                        Nenhum item adicionado.
                    </div>
                )}
            </div>
        </div>
    );
}

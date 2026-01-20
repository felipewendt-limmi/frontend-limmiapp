"use client";
import React, { useState } from 'react';
import { X, Plus } from 'lucide-react';

export default function TagInput({ label, tags, onChange, placeholder = "Adicionar item..." }) {
    const [input, setInput] = useState("");

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            addTag();
        }
    };

    const addTag = () => {
        if (input.trim() && !tags.includes(input.trim())) {
            onChange([...tags, input.trim()]);
            setInput("");
        }
    };

    const removeTag = (tagToRemove) => {
        onChange(tags.filter(tag => tag !== tagToRemove));
    };

    return (
        <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: '500', color: '#475569', marginBottom: '0.5rem' }}>
                {label}
            </label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '0.5rem', minHeight: tags.length > 0 ? 'auto' : '0' }}>
                {tags.map((tag, i) => (
                    <span key={i} style={{
                        background: '#e2e8f0',
                        padding: '4px 10px',
                        borderRadius: '6px',
                        fontSize: '0.875rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                    }}>
                        {tag}
                        <button
                            type="button"
                            onClick={() => removeTag(tag)}
                            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex' }}
                        >
                            <X size={14} color="#64748b" />
                        </button>
                    </span>
                ))}
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={placeholder}
                    style={{ flex: 1, padding: '0.75rem', borderRadius: '8px', border: '1px solid #e2e8f0', outline: 'none' }}
                />
                <button
                    type="button"
                    onClick={addTag}
                    style={{
                        padding: '0 1rem',
                        background: '#eff6ff',
                        color: 'var(--primary)',
                        border: '1px solid #bfdbfe',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontWeight: '600'
                    }}
                >
                    <Plus size={20} />
                </button>
            </div>
        </div>
    );
}

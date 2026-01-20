"use client";
import React, { useState } from 'react';
import { Upload, X, Loader2 } from 'lucide-react';
import axios from 'axios';
import Cookies from 'js-cookie';
import styles from './ImageUploader.module.css';

export default function ImageUploader({ images = [], onChange }) {
    const [uploading, setUploading] = useState(false);

    const handleFileChange = async (e) => {
        const files = Array.from(e.target.files);
        if (files.length === 0) return;

        setUploading(true);

        // Upload each file
        const newImages = [];
        for (const file of files) {
            const formData = new FormData();
            formData.append('file', file);

            try {
                // We need to use the token if the route was protected, but for now upload might be public or token attached
                // Let's assume we need to attach token manually or use the axios instance from context if we passed it.
                // Or just use raw axios and valid URL. 
                const token = Cookies.get('token');
                const res = await axios.post('http://localhost:4000/api/upload', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        'Authorization': `Bearer ${token}`
                    }
                });
                newImages.push(res.data.url);
            } catch (error) {
                console.error("Upload failed", error);
                alert("Falha ao enviar imagem.");
            }
        }

        onChange([...images, ...newImages]);
        setUploading(false);
    };

    const removeImage = (index) => {
        const newImages = images.filter((_, i) => i !== index);
        onChange(newImages);
    };

    return (
        <div>
            <label className={styles.uploader}>
                {uploading ? (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                        <Loader2 className="animate-spin" /> Enviando...
                    </div>
                ) : (
                    <>
                        <Upload size={24} color="#64748b" style={{ marginBottom: '8px' }} />
                        <p style={{ color: '#64748b', fontSize: '0.9rem' }}>Clique para adicionar imagens</p>
                        <input
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={handleFileChange}
                            style={{ display: 'none' }}
                        />
                    </>
                )}
            </label>

            {images.length > 0 && (
                <div className={styles.previewGrid}>
                    {images.map((url, index) => (
                        <div key={index} className={styles.previewItem}>
                            <img src={url} alt={`Upload ${index}`} className={styles.previewImage} />
                            <button
                                type="button"
                                onClick={() => removeImage(index)}
                                className={styles.removeButton}
                            >
                                <X size={14} />
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

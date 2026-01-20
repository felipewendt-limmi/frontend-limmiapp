"use client";
import React, { useEffect, useRef } from 'react';
import styles from './CanvasBackground.module.css';

export default function CanvasBackground() {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        let width, height;
        let particles = [];

        const resize = () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
            initParticles();
        };

        const initParticles = () => {
            particles = [];
            const count = Math.min(width * 0.05, 100); // Responsive count
            for (let i = 0; i < count; i++) {
                particles.push({
                    x: Math.random() * width,
                    y: Math.random() * height,
                    vx: (Math.random() - 0.5) * 0.5,
                    vy: (Math.random() - 0.5) * 0.5,
                    size: Math.random() * 2 + 1,
                    alpha: Math.random() * 0.5 + 0.1
                });
            }
        };

        const draw = () => {
            ctx.clearRect(0, 0, width, height);

            // Draw smooth connections
            ctx.strokeStyle = 'rgba(30, 64, 175, 0.05)'; // Primary color very faint
            ctx.lineWidth = 1;

            for (let i = 0; i < particles.length; i++) {
                const p = particles[i];

                // Move
                p.x += p.vx;
                p.y += p.vy;

                // Bounce
                if (p.x < 0 || p.x > width) p.vx *= -1;
                if (p.y < 0 || p.y > height) p.vy *= -1;

                // Draw particle
                ctx.fillStyle = `rgba(34, 197, 94, ${p.alpha})`; // Secondary color
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fill();

                // Connect
                for (let j = i + 1; j < particles.length; j++) {
                    const p2 = particles[j];
                    const dx = p.x - p2.x;
                    const dy = p.y - p2.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < 150) {
                        ctx.beginPath();
                        ctx.moveTo(p.x, p.y);
                        ctx.lineTo(p2.x, p2.y);
                        ctx.stroke();
                    }
                }
            }

            requestAnimationFrame(draw);
        };

        window.addEventListener('resize', resize);
        resize();
        const animation = requestAnimationFrame(draw);

        return () => {
            window.removeEventListener('resize', resize);
            cancelAnimationFrame(animation);
        };
    }, []);

    return <canvas ref={canvasRef} className={styles.canvasContainer} />;
}

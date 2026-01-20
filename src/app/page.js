"use client";
import React, { useRef } from 'react';
import Link from 'next/link';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Check, Zap, Smartphone, QrCode, Tag, Database } from 'lucide-react';
import CanvasBackground from '@/components/layout/CanvasBackground/CanvasBackground';

// Animation Variants
const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

export default function LandingPage() {
  const targetRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [100, -100]);

  return (
    <div className="bg-white selection:bg-lime-200">
      {/* 1. Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 z-0">
          <CanvasBackground />
          <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-white/80 to-white" />
          {/* Radial Overlay for Contrast */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-white/40 to-white pointer-events-none" />
        </div>

        {/* Header */}
        <nav className="absolute top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-6 md:px-12">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">L</span>
            </div>
            <span className="text-2xl font-bold tracking-tighter text-slate-900">LIMMI.</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a href="#demo" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">Funcionalidades</a>
            <a href="#demo" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">Demo</a>
            <Link href="/contact">
              <button className="px-5 py-2.5 bg-slate-900 text-white text-sm font-medium rounded-full hover:bg-black transition-all hover:scale-105 shadow-lg shadow-blue-900/10">
                Fale com a gente
              </button>
            </Link>
          </div>
        </nav>

        <div className="container mx-auto px-6 z-10 grid md:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="text-left"
          >
            <motion.h1
              variants={fadeInUp}
              className="text-5xl md:text-7xl font-bold tracking-tight mb-6 leading-[1.1]"
            >
              Transforme seu Granel em uma <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-lime-500">
                A Revolução do Seu Granel.
              </span>
            </motion.h1>

            <motion.p
              variants={fadeInUp}
              className="text-lg md:text-xl text-black mb-8 max-w-lg leading-relaxed font-inter"
            >
              Plataforma exclusíva para empórios e mercados modernos. Gestão de laudos, etiquetas inteligentes e a melhor experiência para seu consumidor.
            </motion.p>

            <motion.div
              variants={fadeInUp}
              className="flex flex-wrap gap-4"
            >
              <Link href="https://wa.me/5511999999999" target="_blank" rel="noopener noreferrer">
                <button className="group relative px-8 py-4 bg-blue-600 text-white rounded-full font-semibold overflow-hidden shadow-xl shadow-blue-600/30 hover:shadow-blue-600/50 transition-all hover:-translate-y-1">
                  <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-shimmer" />
                  <span className="flex items-center gap-2">
                    Fale com um Especialista <ArrowRight size={20} />
                  </span>
                </button>
              </Link>
            </motion.div>
          </motion.div>

          {/* Visual Key: 3D Floating Mobile Mockup */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="relative hidden md:block"
          >
            {/* Abstract Decorative Blobs */}
            <div className="absolute -top-20 -right-20 w-72 h-72 bg-lime-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob" />
            <div className="absolute -bottom-20 -left-20 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000" />

            {/* Phone Mockup */}
            <motion.div
              animate={{ y: [0, -20, 0] }}
              transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
              className="relative mx-auto border-gray-800 bg-gray-800 border-[14px] rounded-[2.5rem] h-[600px] w-[300px] shadow-2xl flex flex-col overflow-hidden"
            >
              {/* Screen Content */}
              <div className="h-[32px] w-[3px] bg-gray-800 absolute -left-[17px] top-[72px] rounded-l-lg"></div>
              <div className="h-[46px] w-[3px] bg-gray-800 absolute -left-[17px] top-[124px] rounded-l-lg"></div>
              <div className="h-[46px] w-[3px] bg-gray-800 absolute -left-[17px] top-[178px] rounded-l-lg"></div>
              <div className="h-[64px] w-[3px] bg-gray-800 absolute -right-[17px] top-[142px] rounded-r-lg"></div>

              <div className="rounded-[2rem] overflow-hidden w-full h-full bg-white relative">
                {/* Header Mock */}
                <div className="h-40 bg-gray-100 flex items-end p-4">
                  <div className="w-12 h-12 bg-yellow-400 rounded-full mb-2"></div>
                </div>
                <div className="p-6">
                  <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
                  <div className="h-4 bg-gray-100 rounded w-full mb-2"></div>
                  <div className="h-4 bg-gray-100 rounded w-5/6 mb-6"></div>

                  <div className="grid grid-cols-3 gap-2 mb-6">
                    <div className="h-20 bg-blue-50 rounded-lg"></div>
                    <div className="h-20 bg-blue-50 rounded-lg"></div>
                    <div className="h-20 bg-blue-50 rounded-lg"></div>
                  </div>

                  <div className="h-10 bg-lime-500 rounded-lg w-full mt-auto"></div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* 2. Problem vs Solution (Scroll Reveal) */}
      <section className="py-24 bg-gray-50 overflow-hidden">
        <div className="container mx-auto px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeInUp}
            className="text-center mb-20"
          >
            <h2 className="text-sm font-bold text-blue-700 tracking-widest uppercase mb-3 opacity-100">O Novo Padrão</h2>
            <h3 className="text-3xl md:text-5xl font-bold text-black opacity-100">Evolua do Papel para o Digital.</h3>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* The Problem */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="p-8 md:p-12"
            >
              <h4 className="text-4xl font-bold text-black mb-6">
                "Não venda apenas produtos, venda <span className="text-blue-600 decoration-black underline decoration-4 underline-offset-4">confiança</span>."
              </h4>
              <p className="text-xl text-black leading-relaxed font-inter font-medium">
                O consumidor atual exige transparência. Abandone etiquetas manuais e ofereça acesso imediato à tabela nutricional e origem via QR Code.
              </p>
            </motion.div>

            {/* The Solution */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="bg-white p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden group"
            >
              {/* Decorative Gradient Background */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-transparent to-pink-50/30 opacity-60 group-hover:opacity-100 transition-opacity duration-500" />

              <div className="relative z-10">
                <div className="flex gap-4 mb-8">
                  <div className="p-4 bg-blue-600 text-white rounded-2xl group-hover:scale-110 transition-transform shadow-lg">
                    <Smartphone className="w-6 h-6" />
                  </div>
                  <div className="p-4 bg-lime-500 text-white rounded-2xl group-hover:scale-110 transition-transform delay-75 shadow-lg">
                    <Zap className="w-6 h-6" />
                  </div>
                  <div className="p-4 bg-purple-600 text-white rounded-2xl group-hover:scale-110 transition-transform delay-150 shadow-lg">
                    <Check className="w-6 h-6" />
                  </div>
                </div>
                <h4 className="text-3xl font-bold text-black mb-6">A Solução LIMMI</h4>
                <ul className="space-y-5">
                  <li className="flex items-center gap-4 text-black text-lg font-bold">
                    <div className="w-3 h-3 rounded-full bg-blue-600 shadow-sm" />
                    Tabela Nutricional Completa no Celular
                  </li>
                  <li className="flex items-center gap-4 text-black text-lg font-bold">
                    <div className="w-3 h-3 rounded-full bg-blue-600 shadow-sm" />
                    Sugestões de Uso e Receitas
                  </li>
                  <li className="flex items-center gap-4 text-black text-lg font-bold">
                    <div className="w-3 h-3 rounded-full bg-blue-600 shadow-sm" />
                    Atualização Instantânea
                  </li>
                </ul>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 3. Bento Grid Features */}
      <section className="py-24 bg-white" ref={targetRef}>
        <div className="container mx-auto px-6">
          <div className="mb-16">
            <h2 className="text-4xl font-bold mb-4">Poderoso. Flexível.</h2>
            <p className="text-xl text-gray-500">Ferramentas desenhadas para eficiência operacional.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 grid-rows-2 gap-6 h-auto md:h-[600px]">

            {/* Card 1: Flexibilidade (2x2) */}
            <motion.div
              whileHover={{ scale: 1.01 }}
              className="md:col-span-2 md:row-span-2 bg-indigo-600 rounded-[2.5rem] p-10 flex flex-col justify-between shadow-xl relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500 rounded-full blur-3xl opacity-50 -mr-16 -mt-16 pointer-events-none" />
              <div className="relative z-10">
                <div className="p-4 bg-white/10 w-fit rounded-2xl backdrop-blur-md mb-6 group-hover:rotate-6 transition-transform">
                  <Database size={32} className="text-white" />
                </div>
                <h3 className="text-3xl font-bold mb-4 text-white">Gestão Centralizada</h3>
                <p className="text-indigo-100 text-lg leading-relaxed font-medium">
                  Nós cuidamos da infraestrutura. Você recebe o acesso pronto para cadastrar e gerenciar seus produtos com facilidade.
                </p>
              </div>
              <div className="relative z-10 mt-8 bg-indigo-800/50 backdrop-blur-sm rounded-2xl p-6 border border-indigo-500/30">
                <div className="flex gap-2 mb-3">
                  <span className="px-3 py-1 bg-white/20 text-white rounded-lg text-xs font-bold tracking-wide">Glúten Free</span>
                  <span className="px-3 py-1 bg-white/20 text-white rounded-lg text-xs font-bold tracking-wide">Orgânico</span>
                </div>
                <div className="h-2 w-full bg-indigo-900/50 rounded mb-2" />
                <div className="h-2 w-3/4 bg-indigo-900/50 rounded" />
              </div>
            </motion.div>

            {/* Card 2: QR Generator (1x2) */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="md:col-span-1 md:row-span-2 bg-[#0F172A] text-white rounded-[2.5rem] p-8 flex flex-col items-center justify-center text-center relative overflow-hidden shadow-2xl group"
            >
              <div className="absolute inset-0 bg-blue-600/20 blur-[80px] group-hover:bg-blue-600/30 transition-colors" />
              <div className="relative z-10 flex flex-col items-center">
                <div className="mb-8 relative p-4 bg-white/10 rounded-2xl border border-white/20">
                  <QrCode size={48} className="text-blue-400" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-white">Etiquetas Inteligentes</h3>
                <p className="text-gray-300 text-sm leading-relaxed px-2 font-medium">
                  Geração automática de QR Codes para cada lote.
                </p>
              </div>
            </motion.div>

            {/* Card 3: Mobile First (1x1) */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="md:col-span-1 bg-lime-400 rounded-[2rem] p-8 shadow-xl hover:shadow-2xl hover:shadow-lime-400/30 transition-all duration-300 relative overflow-hidden"
            >
              <Smartphone size={28} className="text-lime-900 mb-4 relative z-10" />
              <h3 className="font-bold text-xl mb-2 text-lime-950 relative z-10">Mobile First</h3>
              <p className="text-lime-900 text-sm relative z-10 font-bold opacity-80">Design responsivo nativo.</p>
            </motion.div>

            {/* Card 4: Tags (1x1) */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="md:col-span-1 bg-blue-500 rounded-[2rem] p-8 shadow-xl hover:shadow-2xl hover:shadow-blue-500/30 transition-all duration-300 relative overflow-hidden"
            >
              <Tag size={28} className="text-white mb-4 relative z-10" />
              <h3 className="font-bold text-xl mb-2 text-white relative z-10">Smart Tags</h3>
              <p className="text-blue-100 text-sm relative z-10 font-medium">Categorização inteligente.</p>
            </motion.div>

          </div>
        </div>
      </section>

      {/* 4. Interactive Demo (Sticky Highlight) */}
      <section id="demo" className="py-24 bg-gradient-to-br from-blue-900 to-slate-900 text-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 opacity-20">
          <div className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] bg-[radial-gradient(circle_at_center,_white_1px,_transparent_1px)] bg-[length:20px_20px]" />
        </div>

        <div className="container mx-auto px-6 relative z-10 text-center">
          <h2 className="text-4xl md:text-6xl font-bold mb-8 tracking-tight">Escaneie e Teste.</h2>
          <p className="text-xl text-blue-200 mb-12 max-w-2xl mx-auto">
            Aponte a câmera do seu celular para este QR Code e veja a experiência do consumidor final agora mesmo.
          </p>

          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", bounce: 0.5 }}
            className="bg-white p-6 rounded-3xl inline-block shadow-2xl shadow-blue-500/20"
          >
            {/* Placeholder for Real QR Code - Using a static one for demo */}
            <img
              src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=http://localhost:3000/demo-store"
              alt="Demo QR Code"
              className="w-48 h-48 md:w-64 md:h-64 rounded-xl"
            />
            <p className="text-gray-500 mt-4 font-mono text-sm">demo-store</p>
          </motion.div>
        </div>
      </section>

      {/* 5. Footer Big Tech */}
      <footer className="bg-white pt-24 pb-12 border-t border-gray-100">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-start mb-16">
            <div className="max-w-md mb-12 md:mb-0">
              <h2 className="text-3xl font-bold mb-6 text-black">Pronto para modernizar seu mercado?</h2>
              <Link href="/admin/login">
                <button className="px-6 py-3 bg-black text-white rounded-lg font-medium hover:bg-gray-800 transition-colors">
                  Acessar Plataforma
                </button>
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-12 sm:gap-24">
              <div>
                <h4 className="font-bold mb-6 text-black">Produto</h4>
                <ul className="space-y-4 text-gray-500">
                  <li className="hover:text-blue-600 cursor-pointer">
                    <a href="#demo">Demo Interativa</a>
                  </li>
                  <li className="hover:text-blue-600 cursor-pointer">
                    <Link href="/admin/login">Login Admin</Link>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold mb-6 text-black">Conecte-se</h4>
                <ul className="space-y-4 text-gray-500">
                  <li className="hover:text-blue-600 cursor-pointer">
                    <a href="https://codebypatrick.dev" target="_blank" rel="noopener noreferrer">Portfólio</a>
                  </li>
                  <li className="hover:text-blue-600 cursor-pointer">Contact</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center opacity-80">
            <div className="font-bold text-2xl tracking-tighter mb-4 md:mb-0 text-black">LIMMI.</div>
            <div className="text-sm text-gray-500 flex flex-col md:flex-row items-center gap-4">
              <span>© 2024 Limmi Tecnologia.</span>
              <span className="hidden md:block">•</span>
              <span>
                Desenvolvido por: <a href="https://codebypatrick.dev" target="_blank" rel="noopener noreferrer" className="font-bold text-black hover:text-blue-600 transition-colors">Patrick.Developer</a>
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
